import { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import NoData from 'components/NoData'
import Button from 'components/form/button'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'
import { LoaderIcon, toast } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { errorHandler } from 'utils/errorHandler'

export default function RequestPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const confirm = useModal(confirmationModal)
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    SupportRequestResponse,
    Error
  >(
    'pending-support-requests',
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/support/list?page=${pageParam}&limit=20&status=pending`,
        )
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  )

  const acceptRequest = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const rest = await privateRequest.patch(`admin/support/acceptRequest/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pending-support-requests')
        queryClient.invalidateQueries('ongoing-support-requests')
        navigate('/customer-support/ongoing')
      },
    },
  )

  const dataList = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div id='scrollableDiv' className='h-[calc(100vh-170px)] overflow-y-auto'>
      <InfiniteScroll
        dataLength={dataList.length}
        next={fetchNextPage}
        hasMore={!!hasNextPage}
        loader={
          <div className='flex gap-2 justify-center items-center'>
            <LoaderIcon />
            Loading...
          </div>
        }
        scrollableTarget='scrollableDiv'
      >
        <table
          className={clsx({
            'blur-sm animate-pulse': isLoading,
          })}
        >
          <thead>
            <tr>
              <td>Name</td>
              <td>Phone Number</td>
              <td>Subject</td>
              {/* <td>Total Appointment</td> */}
              <td className='w-40'>Action</td>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <>
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i}>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td className='w-40'>
                        <Button size='sm'>Accept</Button>
                      </td>
                    </tr>
                  ))}
              </>
            )}
            {dataList.map((row) => (
              <tr key={row._id}>
                <td>{row.user.name}</td>
                <td>{row.user.phone}</td>
                <td>{row.subject}</td>
                <td>
                  <Button
                    onClick={() =>
                      confirm
                        .show({
                          title: 'Accept Request',
                          description: 'Are you sure you want to accept this request?',
                          buttonText: 'Accept',
                        })
                        .then(() =>
                          toast.promise(acceptRequest.mutateAsync(row._id), {
                            loading: 'Accepting...',
                            success: (r) => r.message ?? 'Request Accepted',
                            error: (r) => r.message ?? 'Failed to accept request',
                          }),
                        )
                    }
                    size='sm'
                  >
                    Accept
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
      {!dataList?.length && !isLoading && <NoData />}
    </div>
  )
}
