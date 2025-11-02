import { useModal } from '@ebay/nice-modal-react'
import { BsSearch } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'

import clsx from 'clsx'
import NoData from 'components/NoData'
import Button from 'components/form/button'
import Input from 'components/form/input'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'
import addUpdateSubAdminsModal from 'features/sub-admin/addUpdateSubAdmins.modal'
import { useState } from 'react'
import { LoaderIcon, toast } from 'react-hot-toast'
import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

export default function SubAdminsPage() {
  const confirmation = useModal(confirmationModal)
  const addUpdateSubAdmins = useModal(addUpdateSubAdminsModal)
  const queryClient = useQueryClient()

  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<SubAdminResponse, Error>(
    ['subAdmins', debouncedSearchTerm],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/subAdmin?page=${pageParam}&query=${debouncedSearchTerm}`,
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

  const { mutateAsync: removeSubAdmin } = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const rest = await privateRequest.delete(`admin/subAdmin/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subAdmins')
      },
    },
  )

  const dataList = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div className='card'>
      <div className='flex flex-wrap gap-3 justify-end mb-10'>
        <Button
          icon='add'
          onClick={() => addUpdateSubAdmins.show({ title: 'Add New SubAdmins' })}
          variant='outlined'
          size='md'
        >
          Create New
        </Button>
        <Input
          variant='outlined'
          placeholder='Name/Phone'
          size='md'
          className='md:!w-[230px]'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          afterFix={<BsSearch className='mr-3 text-gray' size={20} />}
        />
      </div>
      <div id='scrollableDiv' className='h-[calc(100vh-325px)] overflow-y-auto'>
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
                <td>Joined date</td>
                <td>Full Name</td>
                <td>Phone Number</td>
                <td>Hospital</td>
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
                        <td>John Doe</td>
                        <td>0123456789</td>
                        <td>--</td>
                        <td>
                          <div className='inline-flex gap-2'>
                            <Button color='default' size='sm'>
                              Edit
                            </Button>
                            <Button color='default' variant='outlined' size='sm'>
                              Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              )}
              {dataList.map((row) => (
                <tr key={row._id}>
                  <td className='whitespace-nowrap'>{dateFormatter(row.createdAt)}</td>
                  <td>{row.name}</td>
                  <td>+880{row.phone}</td>
                  <td>--</td>
                  <td>
                    <div className='inline-flex gap-2'>
                      <Button
                        onClick={() =>
                          addUpdateSubAdmins.show({
                            subAdminId: row._id,
                            title: 'Update SubAdmins',
                          })
                        }
                        size='sm'
                        color='default'
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() =>
                          confirmation
                            .show({
                              title: 'Remove SubAdmin',
                              description: 'Are you sure you want to remove this SubAdmin?',
                              phase: 'danger',
                              buttonText: 'Confirm',
                            })
                            .then(() =>
                              toast.promise(removeSubAdmin(row._id), {
                                loading: 'Removing...',
                                success: (res) => res.message ?? 'SubAdmin removed successfully',
                                error: (err) => err.message ?? 'Something went wrong!',
                              }),
                            )
                        }
                        size='sm'
                        color='danger'
                        variant='outlined'
                      >
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
        {!dataList?.length && !isLoading && <NoData />}
      </div>
    </div>
  )
}
