import { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import Button from 'components/form/button'
import Input from 'components/form/input'
import confirmationModal from 'components/modal/confirmation.modal'
import copy from 'copy-to-clipboard'
import { LoaderIcon, toast } from 'react-hot-toast'
import { BsSearch } from 'react-icons/bs'
import { IoCopy } from 'react-icons/io5'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'

import { privateRequest } from 'config/axios.config'

import NoData from 'components/NoData'
import { useState } from 'react'
import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

export default function DroppedCallsPage() {
  const confirmation = useModal(confirmationModal)
  const queryClient = useQueryClient()

  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    AppointmentResponse,
    Error
  >(
    ['dropped-appointment', debouncedSearchTerm],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/appointment/list?page=${pageParam}&status=dropped&query=${debouncedSearchTerm}`,
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

  const { mutateAsync: rescheduleAppointment } = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const rest = await privateRequest.patch(`admin/appointment/reschedule/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dropped-appointment')
        queryClient.invalidateQueries('bookings')
      },
    },
  )

  const appointments = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div className='card'>
      <div className='flex justify-end mb-10 gap-5'>
        <Input
          variant='outlined'
          placeholder='Name/Phone'
          size='md'
          className='md:!w-[230px] ml-auto'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          afterFix={<BsSearch className='mr-3 text-gray' size={20} />}
        />
      </div>

      <div
        id='scrollableDiv'
        className='h-[calc(100vh-280px)] md:h-[calc(100vh-325px)] overflow-y-auto'
      >
        <InfiniteScroll
          dataLength={appointments.length}
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
                <td>Timestamp</td>
                {/* <td>Dropped on</td> */}
                <td>PID</td>
                <td>Full Name</td>
                <td>Phone Number</td>
                <td>Doctor Name</td>
                <td>BMDC No</td>
                {/* <td>Amount</td> */}
                <td>Amount</td>
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
                        <td>Day Month, Year</td>
                        <td>NOCODE</td>
                        <td>
                          <p className='text-primary'>John Doe</p>
                        </td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>--</td>
                        <td>
                          <div className='inline-flex gap-2'>
                            <Button color='default' size='sm'>
                              ****
                            </Button>
                            <Button color='default' size='sm'>
                              ****
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              )}
              {appointments.map((row) => (
                <tr key={row._id}>
                  <td className='whitespace-nowrap'>{dateFormatter(row.createdAt)}</td>
                  <td className='text-ellipsis max-w-xs flex items-center overflow-hidden'>
                    {row.patient._id}{' '}
                    <Button
                      onClick={() => {
                        copy(row.patient._id)
                        toast.success('Copied to clipboard')
                      }}
                      className='ml-auto'
                      variant='outlined'
                      size='sm'
                    >
                      <IoCopy />
                    </Button>
                  </td>
                  <td>{row.patient.name}</td>
                  <td>{row.patient.phone}</td>
                  <td>{row.doctor?.[0].name}</td>
                  <td>{row.doctor?.[0]?.bmdcCode}</td>
                  <td>{row.totalAmount} Tk.</td>
                  <td>
                    <Button
                      onClick={() =>
                        confirmation
                          .show({
                            phase: 'primary',
                            header: 'Are you sure, you want to arrange  the call again?',
                            buttonText: 'Arrange again',
                          })
                          .then(() =>
                            toast.promise(rescheduleAppointment(row._id), {
                              loading: 'Rescheduling...',
                              success: (res) => res.message ?? 'Rescheduled',
                              error: (err) => err.message ?? 'Failed to reschedule',
                            }),
                          )
                      }
                      size='sm'
                    >
                      Arrange again
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
        {!appointments?.length && !isLoading && <NoData />}
      </div>
    </div>
  )
}
