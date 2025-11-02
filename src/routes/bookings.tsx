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
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'

import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

import NoData from 'components/NoData'
import cancelIcon from 'images/cancellled.png'

type Props = {
  booking_type: AppointmentStatus
}

export default function BookingsPage({ booking_type }: Props) {
  const confirmation = useModal(confirmationModal)
  const queryClient = useQueryClient()

  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    AppointmentResponse,
    Error
  >(
    ['bookings', booking_type, debouncedSearchTerm],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/appointment/list?page=${pageParam}&status=${booking_type}&query=${debouncedSearchTerm}`,
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

  const { mutateAsync: cancelAndRefundAppointment } = useMutation<
    { message: string },
    Error,
    string
  >(
    async (id) => {
      try {
        const rest = await privateRequest.patch(`admin/appointment/cancelAndRefund/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookings')
      },
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
        queryClient.invalidateQueries('bookings')
      },
    },
  )

  const bookings = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div className='card'>
      <div className='flex flex-wrap gap-4 mb-10'>
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
          dataLength={bookings.length}
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
                <td>PID</td>
                <td>Full Name</td>
                <td>Phone Number</td>
                <td>Doctor Name</td>
                <td>BMDC No</td>
                <td>Amount</td>
                {booking_type !== 'refunded' && <td className='w-40'>Action</td>}
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
              {bookings.map((row) => (
                <tr key={row._id}>
                  <td className='whitespace-nowrap'>{dateFormatter(row.createdAt)}</td>
                  <td className='text-ellipsis max-w-xs flex items-center overflow-hidden'>
                    <span className='mr-1'>{row.patient._id}</span>
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
                  <td>{row?.doctor?.[0].bmdcCode}</td>
                  <td>{row.totalAmount} Tk.</td>
                  <td>
                    <div className='inline-flex gap-2'>
                      {booking_type === 'completed' && (
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
                      )}
                      {booking_type === 'queued' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'danger',
                                icon: cancelIcon,
                                header: 'Are you sure, you want to reschedule this booking?',
                                buttonText: 'Reschedule',
                              })
                              .then(() =>
                                toast.promise(cancelAndRefundAppointment(row._id), {
                                  loading: 'Cancelling & Refunding...',
                                  success: (res) => res.message ?? 'Cancelled & Refunded',
                                  error: (err) => err.message ?? 'Failed to cancel & refund',
                                }),
                              )
                          }
                          size='sm'
                          color='danger'
                        >
                          Cancel & Refund
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
        {!bookings?.length && !isLoading && <NoData />}
      </div>
    </div>
  )
}
