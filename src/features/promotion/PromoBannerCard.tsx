import { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'
import { toast } from 'react-hot-toast'
import { BsUpload } from 'react-icons/bs'
import { useMutation, useQueryClient } from 'react-query'
import { errorHandler } from 'utils/errorHandler'
import { assetUrl } from 'utils/url'

export default function PromoBannerCard({ data }: { data: BannerData }) {
  const queryClient = useQueryClient()
  const confirmation = useModal(confirmationModal)

  const deleteMutation = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const rest = await privateRequest.delete(`admin/banner/${id}`)
        return rest.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('banners')
      },
    },
  )
  return (
    <div className='relative overflow-hidden rounded-xl'>
      <img src={assetUrl + data.file} className='h-52 w-full object-cover' alt='' />
      <Button
        onClick={() =>
          confirmation
            .show({
              header: 'Are you sure, you want to delete this banner?',
              buttonText: 'Delete',
              phase: 'danger',
            })
            .then(() =>
              toast.promise(deleteMutation.mutateAsync(data._id), {
                loading: 'Deleting...',
                success: (res) => res.message ?? 'Banner deleted successfully',
                error: (err) => err.message ?? 'Something went wrong',
              }),
            )
        }
        color='default'
        size='sm'
        className='absolute z-10 right-4 bottom-4 !border !border-primary'
      >
        <span className='!text-primary'>Delete</span>
      </Button>
    </div>
  )
}

PromoBannerCard.skeleton = () => (
  <div className='border-2 cursor-pointer border-primary rounded-xl px-10 h-52 flex flex-col justify-center items-center text-center gap-2'>
    <BsUpload className='text-gray-2' size={15} />
    <h2 className='text-gray-2 font-medium text-base'>Upload</h2>
    <p className='text-gray-2 font-medium text-sm'>
      1000px*300px size. Format will be .jpg, .jpeg, .png
    </p>
  </div>
)
