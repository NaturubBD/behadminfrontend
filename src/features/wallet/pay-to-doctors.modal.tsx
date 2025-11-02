import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Skeleton from 'components/Skeleton'
import Tabs from 'components/Tabs'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import DoctorMinimalCard from 'features/doctors/DoctorMinimalCard'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { BsChevronDown } from 'react-icons/bs'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { isAmountValid } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import Modal from '../../components/modal'
import selectBankModal from './select-bank.modal'

const paymentMethods: Option[] = [
  {
    label: 'MFS',
    value: 'mfs',
  },
  {
    label: 'Bank Transfer',
    value: 'bank',
  },
]

type Form = {
  phone: string
  amount: string
  method: TabOption
}

type Payload = {
  doctor: string
  amount: string
  paymentAccount: string
}

export default NiceModal.create(() => {
  const queryClient = useQueryClient()
  const modal = useModal()
  const selectBank = useModal(selectBankModal)
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>()
  const [form, setForm] = useState<Form>({
    phone: '',
    amount: '',
    method: paymentMethods[0],
  })

  const [errors, setErrors] = useState({
    phone: '',
    amount: '',
    paymentAccount: '',
  })

  const payToDoctor = useMutation<{ message: string }, Error, Payload>(
    async (payload) => {
      try {
        const res = await privateRequest.post('admin/wallet/payToDoctor', payload)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        modal.remove()
        queryClient.invalidateQueries('wallet-statistics')
        queryClient.invalidateQueries('wallet-transactions')
      },
    },
  )

  const {
    data: doctor,
    isLoading: isFindingDoctor,
    isError,
  } = useQuery<DoctorDetails, Error>(
    ['single-doctor-by-phone', form.phone],
    async () => {
      try {
        const res = await privateRequest.get(`common/getDoctorByPhone/${form.phone}`)
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      enabled: !!form.phone && form.phone?.length === 10,
      retry: false,
    },
  )

  const { data: getPaymentAccountsByDoctor, isLoading: banksIsLoading } = useQuery<Bank[], Error>(
    ['getPaymentAccountsByDoctor', form.method.value, doctor?._id],
    async () => {
      try {
        const res = await privateRequest.get(
          `common/getPaymentAccountsByDoctor/${doctor?._id}?accountType=${form.method.value}&limit=-1`,
        )
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      enabled: !!doctor?._id,
    },
  )

  useEffect(() => {
    if (getPaymentAccountsByDoctor?.length) {
      setSelectedBank(getPaymentAccountsByDoctor[0])
    } else {
      setSelectedBank(undefined)
    }
  }, [getPaymentAccountsByDoctor])

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'phone' && e.target.value.length === 1 && e.target.value === '0') return
    if (e.target.name === 'phone' && e.target.value.length > 10) return

    const { name, value } = e.target
    if (name === 'amount' && !isAmountValid(value)) return
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const methodTabHandler = (selected: TabOption) => {
    setForm((prev) => ({ ...prev, ['method']: selected }))
  }

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isError || !form.amount || !form.phone || !selectedBank?._id) {
      setErrors((prev) => ({
        ...prev,
        phone: !form.phone
          ? 'Phone number is required'
          : isError
          ? 'Invalid phone number provided'
          : '',
        amount: !form.amount ? 'Amount is required' : '',
        paymentAccount: !selectedBank?._id ? 'Payment Method is required' : '',
      }))
      return
    }
    if ((doctor?.balance ?? 0) < +form.amount) {
      setErrors((prev) => ({
        ...prev,
        amount: (doctor?.balance ?? 0) < +form.amount ? 'Insufficient balance' : '',
      }))
      return
    }

    if (!doctor?._id) {
      toast.error('Doctor not found!')
      return
    }

    const payload: Payload = {
      amount: form.amount,
      paymentAccount: selectedBank?._id,
      doctor: doctor?._id,
    }

    toast.promise(payToDoctor.mutateAsync(payload), {
      loading: 'Paying to doctor...',
      success: (res) => res.message ?? 'Paid to doctor successfully!',
      error: (err) => err.message ?? 'Something went wrong!',
    })
  }

  const setMaxAmount = () => {
    if (!doctor?.balance) return
    setForm((prev) => ({ ...prev, amount: doctor?.balance?.toFixed(2) }))
  }

  return (
    <Modal
      title='Pay to Doctor’s'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <form onSubmit={submitHandler} className='flex flex-col gap-6'>
        <Input
          name='phone'
          value={form.phone}
          onChange={changeHandler}
          label='Doctor’s Phone Number'
          placeholder='1XXXXXXXXX'
          prefix={<span className='mr-2 select-none'>+880</span>}
          error={!!errors.phone}
          helpText={errors.phone}
        />
        {isFindingDoctor && (
          <div className='card flex items-center !bg-primary/5 gap-2'>
            <Skeleton className='h-14 w-14 !rounded-full' />
            <div>
              <Skeleton className='h-4 w-40 mb-2' />
              <Skeleton className='h-2 w-32 mb-2' />
              <Skeleton className='h-2 w-28' />
            </div>
          </div>
        )}
        {doctor && <DoctorMinimalCard doctor={doctor} />}
        <Input
          name='amount'
          value={form.amount}
          onChange={changeHandler}
          label={
            <>
              Amount{' '}
              <span className='ml-auto'>
                {isFindingDoctor ? (
                  <Skeleton className='h-4 w-28' />
                ) : (
                  <>Available Balance {doctor?.balance?.toFixed(2) ?? 0} Tk.</>
                )}
              </span>
            </>
          }
          placeholder='Enter Amount'
          afterFix={
            <>
              <span
                className='select-none uppercase mr-2 text-slate-400 cursor-pointer'
                onClick={setMaxAmount}
              >
                Max
              </span>
              <span className='text-gray-500 mr-3'>TK.</span>
            </>
          }
          error={!!errors.amount}
          helpText={errors.amount}
        />
        <div>
          <Tabs options={paymentMethods} selected={form.method} selectHandler={methodTabHandler} />
        </div>
        <div>
          {form.method.value === 'mfs' && <label>Select MFS</label>}
          {form.method.value === 'bank' && <label>Select Bank Account</label>}
          {banksIsLoading && (
            <div className='px-3 py-5 mt-2 bg-primary-shade relative rounded-lg flex gap-10'>
              <div>
                <Skeleton className='h-3 w-28 mb-3' />
                <Skeleton className='h-3 w-28 mb-3' />
                <Skeleton className='h-3 w-28 mb-3' />
                <Skeleton className='h-3 w-28' />
              </div>
              <div>
                <Skeleton className='h-3 w-40 mb-3' />
                <Skeleton className='h-3 w-40 mb-3' />
                <Skeleton className='h-3 w-40 mb-3' />
                <Skeleton className='h-3 w-40' />
              </div>
            </div>
          )}
          {!banksIsLoading && !getPaymentAccountsByDoctor?.length ? (
            <p className='text-gray px-3 py-4 rounded-md mt-1 text-sm border border-light-gray'>
              No Bank info found
            </p>
          ) : null}
          {selectedBank && (
            <div className={banksIsLoading ? 'blur-sm' : ''}>
              <div
                onClick={() =>
                  selectBank
                    .show({
                      banks: getPaymentAccountsByDoctor ?? [],
                      selected_id: selectedBank._id,
                    })
                    .then((res: any) => {
                      setSelectedBank(res)
                    })
                }
                className='cursor-pointer p-3 mt-2 bg-primary-shade relative rounded-lg'
              >
                <p className='text-sm text-slate-500 mb-2 grid grid-cols-4 gap-5'>
                  Bank Name:{' '}
                  <span className='font-medium text-dark col-span-3'>
                    {selectedBank.bankName ?? selectedBank.title}
                  </span>
                </p>
                {selectedBank.accountName && (
                  <p className='text-sm text-slate-500 mb-2 grid grid-cols-4 gap-5'>
                    Account Name:{' '}
                    <span className='font-medium text-dark col-span-3'>
                      {selectedBank.accountName}
                    </span>
                  </p>
                )}
                {selectedBank.accountNumber && (
                  <p className='text-sm text-slate-500 mb-2 grid grid-cols-4 gap-5'>
                    Account No:{' '}
                    <span className='font-medium text-dark col-span-3'>
                      {selectedBank.accountNumber}
                    </span>
                  </p>
                )}
                {selectedBank.branch && (
                  <p className='text-sm text-slate-500 mb-2 grid grid-cols-4 gap-5'>
                    Branch:{' '}
                    <span className='font-medium text-dark col-span-3'>{selectedBank.branch}</span>
                  </p>
                )}
                <BsChevronDown className='absolute right-4 top-1/2 -translate-y-1/2' size={20} />
              </div>
            </div>
          )}
          {errors.paymentAccount && (
            <p className='text-red-500 text-sm font-semibold mt-3'>{errors.paymentAccount}</p>
          )}
        </div>
        <Button disabled={payToDoctor.isLoading}>Submit</Button>
      </form>
    </Modal>
  )
})
