import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { addPromo } from 'actions/promo'
import DatePickerInput from 'components/DatepickerInput'
import Button from 'components/form/button'
import Input from 'components/form/input'
import Modal from 'components/modal'
import moment from 'moment'
import { useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import { LooseValue } from 'react-date-picker/dist/cjs/shared/types'
import { toast } from 'react-hot-toast'
import { IoClose } from 'react-icons/io5'
import { useMutation, useQueryClient } from 'react-query'

export interface State {
  code: string
  minimumPurchase: string
  discount: string
  maximumDiscount: string
  validFrom: Date
  validTill: Date
  discountFor: 'all' | 'selectedUsers'
  selectedUsers: string[]
}

type Errors = {
  code?: string
  minimumPurchase?: string
  discount?: string
  maximumDiscount?: string
  validFrom?: string
  validTill?: string
  discountFor?: string
  selectedUsers?: string
}

export default NiceModal.create(() => {
  const modal = useModal()

  const queryClient = useQueryClient()

  const [form, setForm] = useState<State>({
    code: '',
    minimumPurchase: '',
    discount: '',
    maximumDiscount: '',
    validFrom: new Date(),
    validTill: moment().add(1, 'days').toDate(),
    discountFor: 'all',
    selectedUsers: [],
  })
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [errors, setErrors] = useState<Errors>({})

  const addPromoMutation = useMutation<{ message: string }, Error, State>(addPromo, {
    onSuccess: () => {
      queryClient.invalidateQueries('get-pormos')
      modal.remove()
    },
  })

  const changeHandler = ({ target: { name, value } }: _ChangeHandlerEvent) => {
    if (name === 'minimumPurchase' || name === 'discount' || name === 'maximumDiscount') {
      if (isNaN(Number(value))) return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const addPhoneNumber = (e: _ChangeHandlerEvent) => {
    const regex = /^[1-9][0-9]*$/
    const value = e.target.value
    if ((value !== '' && !regex.test(value)) || value.length > 10) return
    if (e.key === 'Enter') {
      e.preventDefault()
      if (value === '') return
      setForm((prev) => ({
        ...prev,
        selectedUsers: [...form.selectedUsers, '+880' + value],
      }))
      setPhoneNumber('')
      setErrors((prev) => ({
        ...prev,
        selectedUsers: '',
      }))
    } else {
      setPhoneNumber(e.target.value)
    }
  }

  const dateHandler = (e: LooseValue, name: string) => {
    setForm({
      ...form,
      [name]: e,
    })
  }

  const removePhoneNumber = (index: number) => {
    const newSelectedUsers = [...form.selectedUsers]
    newSelectedUsers.splice(index, 1)
    setForm((prev) => ({
      ...prev,
      selectedUsers: newSelectedUsers,
    }))
  }

  const submitHandler = (e: _FormSubmitEvent) => {
    e.preventDefault()
    if (
      !form.code ||
      !form.minimumPurchase ||
      !form.discount ||
      !form.maximumDiscount ||
      !form.validFrom ||
      !form.validTill ||
      (form.discountFor === 'selectedUsers' && !form.selectedUsers.length)
    ) {
      setErrors((prev) => ({
        ...prev,
        code: !form.code ? 'Code is required' : '',
        minimumPurchase: !form.minimumPurchase ? 'Minimum purchase is required' : '',
        discount: !form.discount ? 'Discount is required' : '',
        maximumDiscount: !form.maximumDiscount ? 'Maximum discount amount is required' : '',
        validFrom: !form.validFrom ? 'Valid from is required' : '',
        validTill: !form.validTill ? 'Valid till is required' : '',
        selectedUsers:
          form.discountFor === 'selectedUsers' && !form.selectedUsers.length
            ? 'Select at least one user'
            : '',
      }))
      return
    }

    toast.promise(addPromoMutation.mutateAsync(form), {
      loading: 'Adding promo...',
      success: (res) => res.message ?? 'Promo added successfully',
      error: (err) => err.message ?? 'Failed to add promo',
    })
  }

  return (
    <Modal
      title='Create New Promo'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <form onSubmit={submitHandler}>
        <div className='grid grid-cols-2 gap-8 mb-6'>
          <div className='flex flex-col gap-5'>
            <Input
              onChange={changeHandler}
              name='code'
              value={form.code}
              label='Promo Code'
              placeholder='Enter promo code'
              helpText={errors.code}
              error={!!errors.code}
            />
            <Input
              onChange={changeHandler}
              name='minimumPurchase'
              value={form.minimumPurchase}
              label='Minimum Purchase'
              placeholder='Enter minimum purchase'
              afterFix={<span className='pr-3'>Tk.</span>}
              helpText={errors.minimumPurchase}
              error={!!errors.minimumPurchase}
            />
            <DatePickerInput
              value={form.validFrom}
              name='validFrom'
              label='Valid From'
              onChange={dateHandler}
              helpText={errors.validFrom}
              error={!!errors.validFrom}
            />
          </div>
          <div className='flex flex-col gap-5'>
            <Input
              onChange={changeHandler}
              name='discount'
              value={form.discount}
              label='Discount'
              placeholder='Enter discount'
              afterFix={<span className='pr-3'>%</span>}
              helpText={errors.discount}
              error={!!errors.discount}
            />
            <Input
              onChange={changeHandler}
              name='maximumDiscount'
              value={form.maximumDiscount}
              label='Maximum Discount'
              placeholder='Enter maximum discount'
              afterFix={<span className='pr-3'>Tk.</span>}
              helpText={errors.maximumDiscount}
              error={!!errors.maximumDiscount}
            />
            <DatePickerInput
              value={form.validTill}
              name='validTill'
              label='Expire Date'
              onChange={dateHandler}
              helpText={errors.validTill}
              error={!!errors.validTill}
            />
          </div>
        </div>
        <div>
          <label className='mb-3 block'>Promo For</label>
          <Input
            className='ml-4'
            type='radio'
            value='all'
            name='discountFor'
            onChange={changeHandler}
            label='All'
          />
          <Input
            className='ml-4'
            type='radio'
            value='selectedUsers'
            name='discountFor'
            onChange={changeHandler}
            label={
              <>
                <label className='bg-primary-shade rounded-lg p-4 flex-1 gap-2 flex flex-wrap'>
                  {form.selectedUsers?.map((phone, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center gap-1 bg-primary text-white p-1 px-2 font-medium text-base rounded-full'
                    >
                      {phone}
                      <IoClose
                        className='cursor-pointer hover:scale-125 hover:bg-white hover:text-primary rounded-full transition-all'
                        onClick={() => removePhoneNumber(index)}
                      />{' '}
                    </span>
                  ))}
                  <div className='inline-flex items-center gap-1'>
                    <strong>+880</strong>
                    <input
                      value={phoneNumber}
                      onKeyDown={addPhoneNumber}
                      onChange={addPhoneNumber}
                      type='text'
                      placeholder='1XXXXXXXXX'
                      className='h-10 w-full outline-none border-none bg-transparent'
                    />
                  </div>
                </label>
              </>
            }
            helpText={errors.selectedUsers}
            error={!!errors.selectedUsers}
          />
        </div>
        <Button className='mt-10' fullWidth>
          Submit
        </Button>
      </form>
    </Modal>
  )
})
