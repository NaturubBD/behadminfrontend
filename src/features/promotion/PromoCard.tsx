import { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import Button from 'components/form/button'
import confirmationModal from 'components/modal/confirmation.modal'
import { privateRequest } from 'config/axios.config'
import moment from 'moment'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { errorHandler } from 'utils/errorHandler'
import updatePromoModal from './update-promo.modal'

export default function PromoCard({ promo, className }: { promo: Promo; className?: string }) {
  const confirmation = useModal(confirmationModal)
  const updatePromo = useModal(updatePromoModal)
  const queryClient = useQueryClient()

  const deletePromo = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const res = await privateRequest.delete(`/admin/promo/${id}`)
        return res.data
      } catch (err) {
        errorHandler(err)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('get-pormos')
      },
    },
  )

  const togglePromoStatus = useMutation<{ message: string }, Error, string>(
    async (id) => {
      try {
        const res = await privateRequest.patch(`/admin/promo/toggleStatus/${id}`)
        return res.data
      } catch (err) {
        errorHandler(err)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('get-pormos')
      },
    },
  )

  return (
    <div className={clsx('border-[1.5px] border-primary rounded-xl p-4', className)}>
      <h2 className='text-primary flex items-center justify-between font-semibold text-2xl'>
        {promo.code}{' '}
        <div className='font-medium text-xs'>
          <p className='leading-6'>{promo.discount}%OFF</p>
          <p className='leading-6'>Up to {promo.maximumDiscount} Tk.</p>
        </div>
      </h2>
      <strong className='font-medium text-xs'>
        * Minimum Purchase {promo.minimumPurchase} Tk.
      </strong>
      <p className='text-xs'>
        * Promo For <span className='text-primary'>@{promo.discountFor}</span>
      </p>

      <div className='mt-3 grid grid-cols-2 gap-10'>
        <div>
          <p className='text-gray text-sm'>Valid From</p>
          <h5 className='font-semibold text-xs mt-2'>
            {moment(promo.validFrom).format('DD MMMM, YYYY')}
          </h5>
        </div>
        <div>
          <p className='text-gray text-sm'>Valid Till</p>
          <h5 className='font-semibold text-xs mt-2'>
            {moment(promo.validTill).format('DD MMMM, YYYY')}
          </h5>
        </div>
      </div>

      <div className='flex flex-wrap gap-3 mt-5'>
        <Button size='sm' onClick={() => updatePromo.show({ promo: promo })}>
          Edit
        </Button>
        {promo.status === 'active' && (
          <Button
            onClick={() =>
              confirmation
                .show({
                  header: 'Are you sure, you want to deactivate this promo code?',
                  buttonText: 'Mark as expired',
                  phase: 'danger',
                })
                .then(() =>
                  toast.promise(togglePromoStatus.mutateAsync(promo._id), {
                    loading: 'Deactivating...',
                    success: (res) => res.message ?? 'Promo code deactivated successfully',
                    error: (err) => err.message ?? 'Something went wrong!',
                  }),
                )
            }
            size='sm'
            variant='outlined'
          >
            Mark as Expired
          </Button>
        )}
        {promo.status === 'inactive' && (
          <Button
            onClick={() =>
              confirmation
                .show({
                  header: 'Are you sure, you want to activate this promo code?',
                  buttonText: 'Activate',
                  phase: 'success',
                })
                .then(() =>
                  toast.promise(togglePromoStatus.mutateAsync(promo._id), {
                    loading: 'Activating...',
                    success: (res) => res.message ?? 'Promo code activated successfully',
                    error: (err) => err.message ?? 'Something went wrong!',
                  }),
                )
            }
            size='sm'
            variant='outlined'
          >
            Activate
          </Button>
        )}
        <Button
          onClick={() =>
            confirmation
              .show({
                header: 'Are you sure, you want to delete this promo code?',
                buttonText: 'Delete',
                phase: 'danger',
              })
              .then(() =>
                toast.promise(deletePromo.mutateAsync(promo._id), {
                  loading: 'Deleting...',
                  success: (res) => res.message ?? 'Promo code deleted successfully',
                  error: (err) => err.message ?? 'Something went wrong!',
                }),
              )
          }
          size='sm'
          variant='outlined'
          color='danger'
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

PromoCard.skeleton = () => (
  <div className='border-[1.5px] border-primary rounded-xl p-4 blur-sm animate-pulse'>
    <h2 className='text-primary flex items-center justify-between font-semibold text-2xl'>
      ******{' '}
      <div className='font-medium text-xs'>
        <p className='leading-6'>**%OFF</p>
        <p className='leading-6'>Up to **** Tk.</p>
      </div>
    </h2>
    <strong className='font-medium text-xs'>* Minimum Purchase **** Tk.</strong>
    <p className='text-xs'>
      * Promo For <span className='text-primary'>@all</span>
    </p>

    <div className='mt-3 grid grid-cols-2 gap-10'>
      <div>
        <p className='text-gray text-sm'>Valid From</p>
        <h5 className='font-semibold text-xs mt-2'>** May, 20**</h5>
      </div>
      <div>
        <p className='text-gray text-sm'>Valid Till</p>
        <h5 className='font-semibold text-xs mt-2'>** May, 20**</h5>
      </div>
    </div>

    <div className='flex gap-3 mt-5'>
      <Button size='sm'>Edit</Button>
      <Button size='sm' variant='outlined'>
        Mark As Expired
      </Button>
      <Button size='sm' variant='outlined'>
        Delete
      </Button>
    </div>
  </div>
)
