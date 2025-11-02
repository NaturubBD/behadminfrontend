import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { isAmountValid } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import Modal from '../../components/modal'

type Payload = {
  amount: string
  note: string
}

export default NiceModal.create(() => {
  const queryClient = useQueryClient()
  const modal = useModal()

  const [form, setForm] = useState<Payload>({
    amount: '',
    note: '',
  })

  const [errors, setErrors] = useState<Payload>({
    amount: '',
    note: '',
  })

  const payToEyeBuddy = useMutation<{ message: string }, Error, Payload>(
    async (payload) => {
      try {
        const res = await privateRequest.post('admin/wallet/payToEyeBuddy', payload)
        return res.data
      } catch (err) {
        errorHandler(err)
      }
    },
    {
      onSuccess: () => {
        modal.remove()
        queryClient.invalidateQueries('wallet-statistics')
      },
    },
  )

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'amount' && !isAmountValid(value)) return
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.amount) {
      setErrors((prev) => ({ ...prev, amount: 'Amount is required' }))
      return
    }

    toast.promise(payToEyeBuddy.mutateAsync({ amount: form.amount, note: form.note }), {
      loading: 'Loading...',
      success: (r) => r.message ?? 'Successfully paid to EyeBuddy',
      error: (r) => r.message ?? 'Failed to pay to EyeBuddy',
    })
  }

  return (
    <Modal
      title='Pay to EyeBuddy'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <form onSubmit={submitHandler} className='flex flex-col gap-6'>
        <Input
          name='amount'
          value={form.amount}
          onChange={changeHandler}
          label='Amount'
          placeholder='Enter Amount'
          afterFix={<span className='text-gray-500 font-medium mr-3'>TK.</span>}
          error={!!errors.amount}
          helpText={errors.amount}
        />
        <Input
          multiline
          name='note'
          value={form.note}
          onChange={changeHandler}
          label='Note'
          placeholder='Enter your note'
          error={!!errors.note}
          helpText={errors.note}
        />
        <Button disabled={payToEyeBuddy.isLoading}>Submit</Button>
      </form>
    </Modal>
  )
})
