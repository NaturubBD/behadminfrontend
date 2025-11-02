import { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import { useState } from 'react'
import { LoaderIcon, toast } from 'react-hot-toast'
import { BsSearch } from 'react-icons/bs'
import { RxCopy } from 'react-icons/rx'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'

import NoData from 'components/NoData'
import Button from 'components/form/button'
import Input from 'components/form/input'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'

import copy from 'copy-to-clipboard'
import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

type Props = {
  doctor_type: DoctorStatus
}

export default function DoctorsPage({ doctor_type }: Props) {
  const confirmation = useModal(confirmationModal)
  const queryClient = useQueryClient()

  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<DoctorsResponse, Error>(
    ['doctors', doctor_type, debouncedSearchTerm],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/doctor?page=${pageParam}&status=${doctor_type}&query=${debouncedSearchTerm}`,
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

  const { mutateAsync: toggleDoctorStatus } = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const rest = await privateRequest.patch(`admin/doctor/toggleStatus/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('doctors')
      },
    },
  )

  const doctors = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div className='card'>
      <div className='flex flex-wrap gap-4 mb-10'>
        <Button to='/all-doctors/add' icon='add' variant='outlined' size='md'>
          Add New
        </Button>
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
        className='h-[calc(100vh-340px)] md:h-[calc(100vh-325px)] overflow-y-auto'
      >
        <InfiniteScroll
          dataLength={doctors.length}
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
                <td>BMDC No</td>
                <td>Full Name</td>
                <td>Phone Number</td>
                {doctor_type !== 'waitingForApproval' && <td>Total Appointments</td>}
                {doctor_type !== 'waitingForApproval' && <td>Total Earnings</td>}
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
                        <td>0123456789</td>
                        {doctor_type !== 'waitingForApproval' && <td>00.00</td>}
                        {doctor_type !== 'waitingForApproval' && <td>00.00 Tk.</td>}
                        <td>
                          <div className='inline-flex gap-2'>
                            {doctor_type === 'disabled' && <Button size='sm'>Active</Button>}
                            {doctor_type === 'activated' && (
                              <Button size='sm' color='danger'>
                                Deactivate
                              </Button>
                            )}
                            {doctor_type === 'waitingForApproval' && (
                              <Button size='sm' color='primary'>
                                Approve
                              </Button>
                            )}
                            <Button color='default' size='sm'>
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </>
              )}
              {doctors.map((row) => (
                <tr key={row._id}>
                  <td className='whitespace-nowrap'>{dateFormatter(row.createdAt)}</td>
                  <td>{row.bmdcCode}</td>
                  <td>
                    <Link className='text-primary' to={`/all-doctors/${row._id}`}>
                      {row.name}
                    </Link>
                  </td>
                  <td>
                    <div className='flex items-center justify-between'>
                      <span>
                        <span className='select-none text-gray mr-1'>+880</span>
                        {row.phone}
                      </span>
                      <RxCopy
                        className='cursor-pointer text-gray mr-4'
                        size={20}
                        onClick={() => {
                          copy(row.phone)
                          toast.success('Phone number copied successfully')
                        }}
                      />
                    </div>
                  </td>
                  {doctor_type !== 'waitingForApproval' && <td>{row.totalConsultationCount}</td>}
                  {doctor_type !== 'waitingForApproval' && (
                    <td>{row.totalConsultationCount ?? 0 * row.consultationFee} Tk.</td>
                  )}
                  <td>
                    <div className='inline-flex gap-2'>
                      {doctor_type === 'disabled' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'primary',
                                header: 'Are you sure, you want to activate this doctor ?',
                                buttonText: 'Activate',
                              })
                              .then(() =>
                                toast.promise(toggleDoctorStatus(row._id), {
                                  loading: 'Activating doctor...',
                                  success: (res) => res.message ?? 'Doctor activated successfully',
                                  error: (err) => err.message ?? 'Something went wrong!',
                                }),
                              )
                          }
                          size='sm'
                        >
                          Activate
                        </Button>
                      )}
                      {doctor_type === 'activated' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'danger',
                                header: 'Are you sure, you want to deactivate this doctor ?',
                                buttonText: 'Deactivate',
                              })
                              .then(() =>
                                toast.promise(toggleDoctorStatus(row._id), {
                                  loading: 'Deactivating doctor...',
                                  success: (res) =>
                                    res.message ?? 'Doctor deactivated successfully',
                                  error: (err) => err.message ?? 'Something went wrong!',
                                }),
                              )
                          }
                          size='sm'
                          color='danger'
                        >
                          Deactivate
                        </Button>
                      )}
                      {doctor_type === 'waitingForApproval' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'primary',
                                header: 'Are you sure, you approved this doctor?',
                                buttonText: 'Yes, Approve',
                              })
                              .then(() =>
                                toast.promise(toggleDoctorStatus(row._id), {
                                  loading: 'Approving doctor...',
                                  success: (res) => res.message ?? 'Doctor approved successfully',
                                  error: (err) => err.message ?? 'Something went wrong!',
                                }),
                              )
                          }
                          size='sm'
                          color='primary'
                        >
                          Approve
                        </Button>
                      )}
                      <Link
                        className='btn btn-sm btn-default btn-container'
                        to={`/all-doctors/edit/${row._id}`}
                        state={{ data: row }}
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
        {!doctors?.length && !isLoading && <NoData />}
      </div>
    </div>
  )
}
