import NiceModal, { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import Button from 'components/form/button'
import CheckIcon from 'components/icons/checkIcon'
import Modal from 'components/modal'
import { privateRequest } from 'config/axios.config'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

const methods: Option[] = [
  {
    label: 'Bank Transfer',
    value: 'bank',
  },
  {
    label: 'Cash Payment',
    value: 'cash',
  },
  {
    label: 'By Cheque',
    value: 'cheque',
  },
]

export default NiceModal.create(({ transaction_id }: { transaction_id: string }) => {
  const modal = useModal()
  const queryClient = useQueryClient()

  const [selectedMethod, setSelectedMethod] = useState<string>('')

  const approveWithdraw = useMutation<{ message: string }, Error>(
    async () => {
      try {
        const res = await privateRequest.patch(`admin/withdraw/approveWithdraw/${transaction_id}`, {
          transferredBy: selectedMethod,
        })
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('withdrawals')
        queryClient.invalidateQueries('withdrawal-statistics')
      },
    },
  )

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!selectedMethod) {
      toast.error('Please select a method')
      return
    }

    toast.promise(approveWithdraw.mutateAsync(), {
      loading: 'Approving Withdrawal',
      success: (r) => r.message ?? 'Withdrawal Approved',
      error: (r) => r.message ?? 'Failed to approve withdrawal',
    })
    modal.remove()
  }

  return (
    <Modal
      title='Transferred By?'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <div className='flex flex-col gap-2'>
        {methods.map((method, i) => (
          <div
            onClick={() => setSelectedMethod(method.value)}
            key={i}
            className={clsx(
              'cursor-pointer rounded-md text-base p-4 font-medium flex justify-between items-center',
              {
                'bg-primary text-white': selectedMethod === method.value,
                'bg-default text-dark': selectedMethod !== method.value,
              },
            )}
          >
            {method.label}
            <div
              className={clsx(
                'grid place-items-center h-[25px] w-[25px] rounded-full border border-primary bg-white',
              )}
            >
              {selectedMethod === method.value && <CheckIcon className='text-primary' />}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={submitHandler} className='flex gap-5 justify-between mt-10'>
        <Button
          fullWidth
          onClick={() => {
            modal.reject()
            modal.hide()
          }}
          color='default'
          type='button'
        >
          Cancel
        </Button>
        <Button fullWidth color='primary'>
          Transfer
        </Button>
      </form>
    </Modal>
  )
})
