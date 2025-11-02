import { useModal } from '@ebay/nice-modal-react'
import Devider from 'components/Devider'
import Title from 'components/Title'
import Button from 'components/form/button'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'
import DoctorDetailsSkeleton from 'features/doctors/DoctorDetailsSkeleton'
import ExperienceCard from 'features/doctors/ExperiencCard'
import { toast } from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { errorHandler } from 'utils/errorHandler'

export default function SingleDoctor() {
  const queryClient = useQueryClient()
  const confirmation = useModal(confirmationModal)
  const id = useParams<{ id: string }>().id

  const { data, isLoading } = useQuery<DoctorsDoc, Error>(['doctor-details', id], async () => {
    try {
      const res = await privateRequest.get(`admin/doctor/${id}`)
      return res.data.data
    } catch (error) {
      errorHandler(error)
    }
  })

  const toggleDoctorStatus = useMutation<{ message: string }, Error>(
    async () => {
      try {
        const res = await privateRequest.patch(`admin/doctor/toggleStatus/${id}`)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('doctor-details')
        queryClient.invalidateQueries('doctors')
      },
    },
  )

  if (isLoading) {
    return <DoctorDetailsSkeleton />
  }

  return (
    <div className='card'>
      <div className='flex mb-8 gap-8 items-center'>
        <div className='h-28 w-28 rounded-full bg-primary'></div>
        <div className='border-b border-[#BBBBBB] flex-1 pb-5'>
          <h3 className='font-medium text-[26px] mb-2'>{data?.name}</h3>
          <p className='text-gray text[18px] mb-1'>{data?.specialty?.title}</p>
          <p className='text-lg'>{data?.hospital?.name}</p>
        </div>
      </div>

      <div className='flex flex-wrap gap-14'>
        <div>
          <p className='text-gray text-lg mb-3'>Experience in</p>
          <h5 className='text-lg font-medium'>{data?.experienceInYear} Years</h5>
        </div>
        <div>
          <p className='text-gray text-lg mb-3'>Consultation Fee</p>
          <h5 className='text-lg font-medium'>
            ৳ {data?.consultationFee}{' '}
            <span className='text-xs text-gray font-normal'>(Incl 5% vat)</span>
          </h5>
        </div>
        <div>
          <p className='text-gray text-lg mb-3'>BMDC No</p>
          <h5 className='text-lg font-medium'>{data?.bmdcCode}</h5>
        </div>
        <div>
          <p className='text-gray text-lg mb-3'>Followup Fee</p>
          <h5 className='text-lg font-medium'>
            ৳ {data?.followupFee}{' '}
            <span className='text-xs text-gray font-normal'>(Incl 5% vat)</span>
          </h5>
        </div>
      </div>

      <Devider />
      <Title variant='card_title'>About Doctor</Title>
      <p className='text-sm leading-8 mt-4'>{data?.about}</p>
      {/* <ol className='list-disc ml-4 my-6'>
        <li className='text-sm leading-7'>
          It has survived not only five centuries, but also the leap{' '}
        </li>
        <li className='text-sm leading-7'>
          into electronic typesetting, remaining essentially unchang ed.{' '}
        </li>
        <li className='text-sm leading-7'>Lorem Ipsum has been the {`industry's`} standard </li>
        <li className='text-sm leading-7'>
          dummy text ever since the 1500s, when an unknown printer took{' '}
        </li>
        <li className='text-sm leading-7'>
          a galley of type and scrambled it to make a type specimen book.{' '}
        </li>
      </ol> */}
      <Title variant='card_title'>Experience</Title>
      <div className='grid grid-cols-3 gap-4 mt-6'>
        {data?.experiences?.map((row) => (
          <ExperienceCard key={row._id} data={row} />
        ))}
      </div>
      <div className='flex justify-end mt-20'>
        <Button
          onClick={() =>
            confirmation
              .show({
                phase: data?.status === 'activated' ? 'danger' : 'primary',
                header: `Are you sure, you want to make this action?`,
                buttonText: `Yes, ${data?.status === 'activated' ? 'Disable' : 'Activate'}`,
              })
              .then(() =>
                toast.promise(toggleDoctorStatus.mutateAsync(), {
                  loading: 'Please wait...',
                  success: (r) =>
                    r.message ??
                    `Doctor ${data?.status === 'disabled' ? 'Disabled' : 'Activated'} successfully`,
                  error: (r) => r.message ?? 'Something went wrong!',
                }),
              )
          }
          className='lg:!px-20'
          color={data?.status === 'activated' ? 'danger' : 'primary'}
        >
          {data?.status === 'waitingForApproval' && 'Approve'}
          {data?.status === 'activated' && 'Disable'}
          {data?.status === 'disabled' && 'Activate'}
        </Button>
      </div>
    </div>
  )
}
