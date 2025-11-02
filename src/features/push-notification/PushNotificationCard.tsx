import { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'
import { toast } from 'react-hot-toast'
import { BsFillClockFill } from 'react-icons/bs'
import { useMutation, useQueryClient } from 'react-query'
import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import { assetUrl } from 'utils/url'
import addUpdatePushNotificationModal from './add-update-push-notification.modal'

export default function PushNotificationCard({ data }: { data: NotificationData }) {
  const queryClient = useQueryClient()
  const confirmation = useModal(confirmationModal)
  const addUpdatePushNotification = useModal(addUpdatePushNotificationModal)

  const deleteMutation = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const rest = await privateRequest.delete(`admin/notification/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
      },
    },
  )

  return (
    <div className='border-[1.5px] border-primary rounded-xl p-4'>
      <h2 className='font-semibold text-sm mb-2'>{data.title}</h2>
      <p className='text-xs font-medium text-gray mb-3'>{data.body}</p>

      {data.banner && (
        <img className='h-40 w-full object-cover rounded-lg' src={assetUrl + data.banner} />
      )}

      <div className='flex text-sm font-medium mt-5 justify-between gap-4'>
        <div className='flex items-center gap-1'>
          <BsFillClockFill className='text-primary' /> Scheduled on
        </div>
        <span>{data.scheduledAt ? dateFormatter(data.scheduledAt) : 'Now'}</span>
      </div>

      <div className='flex gap-3 justify-end mt-5'>
        {data?.status === 'scheduled' && (
          <Button size='sm' onClick={() => addUpdatePushNotification.show({ _id: data._id, data })}>
            Edit
          </Button>
        )}
        <Button
          onClick={() =>
            confirmation
              .show({
                header: 'Are you sure, you want to delete this push notification?',
                buttonText: 'Delete',
                phase: 'danger',
              })
              .then(() =>
                toast.promise(deleteMutation.mutateAsync(data._id), {
                  loading: 'Deleting...',
                  success: (res) => res.message ?? 'Push Notification deleted successfully',
                  error: (err) => err.message ?? 'Something went wrong',
                }),
              )
          }
          size='sm'
          variant='outlined'
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

PushNotificationCard.skeleton = () => (
  <div className='border-[1.5px] border-primary rounded-xl p-4'>
    <h2 className='font-semibold text-sm mb-2'>Notification Title</h2>
    <p className='text-xs font-medium text-gray'>Notification Body</p>
    <div className='flex text-sm font-medium mt-5 justify-between gap-4'>
      <div className='flex items-center gap-1'>
        <BsFillClockFill className='text-primary' /> Scheduled on
      </div>
      <span>**-**-****</span>
    </div>

    <div className='flex gap-3 justify-end mt-5'>
      <Button size='sm'>Edit</Button>
      <Button size='sm' variant='outlined'>
        Delete
      </Button>
    </div>
  </div>
)
