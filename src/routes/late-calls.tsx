import { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import copy from 'copy-to-clipboard'
import { useState } from 'react'
import { LoaderIcon, toast } from 'react-hot-toast'
import { BsSearch } from 'react-icons/bs'
import { IoCopy } from 'react-icons/io5'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'

import Button from 'components/form/button'
import Input from 'components/form/input'
import Select from 'components/form/select'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'

import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

import NoData from 'components/NoData'
import Badge from 'components/form/Badge'
import cancelIcon from 'images/cancellled.png'

export default function LateCallsPage() {
  const confirmation = useModal(confirmationModal)
  const queryClient = useQueryClient()

  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    AppointmentResponse,
    Error
  >(
    ['late-appointment', debouncedSearchTerm],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/appointment/list?page=${pageParam}&status=late&query=${debouncedSearchTerm}`,
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
        queryClient.invalidateQueries('late-appointment')
        queryClient.invalidateQueries('bookings')
      },
    },
  )

  const appointments = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div className='card'>
      <div className='flex justify-end mb-10 gap-5'>
        <Select
          size='md'
          variant='outlined'
          options={[{ label: 'Above 15 Mins', value: 'Above 15 Mins' }]}
          value={{ label: 'Above 15 Mins', value: 'Above 15 Mins' }}
          onChange={(e) => console.log(e)}
        />
        <Input
          variant='outlined'
          placeholder='Name/Phone'
          size='md'
          className='!w-[230px]'
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
                {/* <td>late on</td> */}
                <td>PID</td>
                <td>Full Name</td>
                <td>Phone Number</td>
                <td>Doctor Name</td>
                <td>BMDC No</td>
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
                          <Button color='default' size='sm'>
                            ****
                          </Button>
                        </td>
                      </tr>
                    ))}
                </>
              )}
              {appointments.map((row) => (
                <tr key={row._id}>
                  <td className='whitespace-nowrap'>{dateFormatter(row.createdAt)}</td>
                  <td className='flex items-center'>
                    <span className='text-ellipsis overflow-hidden w-16'>{row.patient._id}</span>{' '}
                    <Badge
                      onClick={() => {
                        copy(row.patient._id)
                        toast.success('Copied to clipboard')
                      }}
                      className='ml-auto !px-2 cursor-pointer'
                    >
                      <IoCopy />
                    </Badge>
                  </td>
                  <td>{row.patient.name}</td>
                  <td>{row.patient.phone}</td>
                  <td>{row.doctor?.[0].name}</td>
                  <td>{row.doctor?.[0].bmdcCode}</td>
                  <td>{row.totalAmount} Tk.</td>
                  <td>
                    <Button
                      onClick={() =>
                        confirmation
                          .show({
                            phase: 'danger',
                            icon: cancelIcon,
                            header: 'Are you sure, you want to Reschedule this booking?',
                            buttonText: 'Reschedule',
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
                      color='danger'
                    >
                      Cancel & Refund
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
