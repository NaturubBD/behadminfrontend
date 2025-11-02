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
import addUpdatePatientsModal from 'features/patients/addUpdatePatients.modal'
import { useState } from 'react'
import { LoaderIcon, toast } from 'react-hot-toast'
import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

type Props = {
  patient_type: 'waitingForApproval' | 'activated' | 'disabled'
}

export default function PatientsPage({ patient_type }: Props) {
  const confirmation = useModal(confirmationModal)
  const addUpdatePatients = useModal(addUpdatePatientsModal)
  const queryClient = useQueryClient()

  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<PatientsResponse, Error>(
    ['patients', patient_type, debouncedSearchTerm],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/patient?page=${pageParam}&status=${patient_type}&query=${debouncedSearchTerm}`,
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

  const { mutateAsync: toggleStatus } = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const rest = await privateRequest.patch(`admin/patient/toggleStatus/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('patients')
      },
    },
  )

  const patients = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <div className='card'>
      <div className='flex flex-wrap gap-4 mb-10'>
        <Button
          icon='add'
          onClick={() => addUpdatePatients.show({ title: 'Add New Patient' })}
          variant='outlined'
          size='md'
        >
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
          dataLength={patients.length}
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
                <td>PID</td>
                <td>Full Name</td>
                <td>Phone Number</td>
                <td>Total Appointments</td>
                <td>Total Consultations</td>
                <td>Action</td>
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
                        {patient_type !== 'waitingForApproval' && <td>00.00</td>}
                        {patient_type !== 'waitingForApproval' && <td>00.00 Tk.</td>}
                        <td>
                          <div className='inline-flex gap-2'>
                            {patient_type === 'disabled' && <Button size='sm'>Active</Button>}
                            {patient_type === 'activated' && (
                              <Button size='sm' color='danger'>
                                Deactivate
                              </Button>
                            )}
                            {patient_type === 'waitingForApproval' && (
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
              {patients.map((row) => (
                <tr key={row._id}>
                  <td className='whitespace-nowrap'>{dateFormatter(row.createdAt)}</td>
                  <td>{row._id}</td>
                  <td>{row.name}</td>
                  <td>
                    <span className='select-none text-gray mr-1'>+880</span>
                    {row.phone}
                  </td>
                  <td>{row.totalConsultationCount}</td>
                  <td>{row.totalConsultationCount}</td>
                  <td>
                    <div className='inline-flex gap-2'>
                      {patient_type === 'disabled' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'primary',
                                header: 'Are you sure, you want to Activate this Patient ?',
                                buttonText: 'Activate',
                              })
                              .then(() =>
                                toast.promise(toggleStatus(row._id), {
                                  loading: 'Activating patient...',
                                  success: (res) => res.message ?? 'Patient activated successfully',
                                  error: (err) => err.message ?? 'Something went wrong!',
                                }),
                              )
                          }
                          size='sm'
                        >
                          Activate
                        </Button>
                      )}
                      {patient_type === 'activated' && (
                        <Button
                          onClick={() =>
                            confirmation
                              .show({
                                phase: 'danger',
                                header: 'Are you sure, you want to Deactivate this Patient ?',
                                buttonText: 'Deactivate',
                              })
                              .then(() =>
                                toast.promise(toggleStatus(row._id), {
                                  loading: 'Deactivating patient...',
                                  success: (res) =>
                                    res.message ?? 'Patient deactivated successfully',
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
                      {patient_type === 'waitingForApproval' && (
                        <Button
                          onClick={() =>
                            confirmation.show({
                              phase: 'primary',
                              header: 'Are you sure, you approved this patient?',
                              buttonText: 'Yes, Approve',
                            })
                          }
                          size='sm'
                          color='primary'
                        >
                          Approve
                        </Button>
                      )}
                      <Button
                        onClick={() =>
                          addUpdatePatients.show({ patient: row, title: 'Update Patient' })
                        }
                        size='sm'
                        color='default'
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
        {!patients?.length && !isLoading && <NoData />}
      </div>
    </div>
  )
}
