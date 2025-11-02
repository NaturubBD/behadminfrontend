import { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'
import { SupportContext } from 'context/supportContext'
import { useContext } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { errorHandler } from 'utils/errorHandler'
import { assetUrl } from 'utils/url'

export default function ActiveCustomer() {
  const queryClient = useQueryClient()
  const confirm = useModal(confirmationModal)

  const { customer, setCustomer } = useContext(SupportContext)
  const markAsResolved = useMutation<
    { message: string },
    Error,
    {
      id: string
      resolveNote: string
    }
  >(
    async ({ id, resolveNote }) => {
      try {
        const rest = await privateRequest.patch(`admin/support/markAsResolved/${id}`, {
          resolveNote,
        })
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        setCustomer(null)
        queryClient.invalidateQueries('ongoing-support-requests')
        queryClient.invalidateQueries('resolved-support-requests')
      },
    },
  )

  if (!customer) return <div className='h-20' />
  return (
    <div className='border-b-[0.5px] flex flex-wrap gap-2 justify-between items-center lg:h-20 pb-2 lg:pb-0 border-[#CECECE]'>
      {customer?.user?.photo && (
        <img
          src={assetUrl + customer?.user?.photo}
          className='h-12 w-12 rounded-full overflow-hidden object-cover'
          alt=''
        />
      )}
      <div className='flex-1'>
        <h2 className='text-base font-medium mb-1'>{customer?.user.name}</h2>
        <p className='text-xs text-[#777]'>Active now</p>
      </div>
      <Button
        onClick={() =>
          confirm
            .show({
              title: 'Mark As Resolved',
              description: 'Are you sure you want to mark this request as resolved?',
              buttonText: 'Mark As Resolved',
              isNoteRequired: true,
            })
            .then((note) =>
              toast.promise(
                markAsResolved.mutateAsync({
                  id: customer._id,
                  resolveNote: note as string,
                }),
                {
                  loading: 'Marking as resolved...',
                  success: (r) => r.message ?? 'Request marked as resolved',
                  error: (r) => r.message ?? 'Failed to mark as resolved',
                },
              ),
            )
        }
        size='sm'
      >
        Mark As Resolved
      </Button>
    </div>
  )
}
