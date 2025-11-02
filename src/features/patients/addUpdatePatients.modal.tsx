import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import Modal from 'components/modal'
import { privateRequest } from 'config/axios.config'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

interface Payload {
  name: string
  phone: string
  dialCode: string
}
interface PatientUpdatePayload extends Payload {
  id: string
}

export default NiceModal.create(({ patient, title }: { patient?: Patient; title: string }) => {
  const modal = useModal()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: '',
    phone: '',
  })

  const [errors, setErrors] = useState<{
    name?: string
    phone?: string
  }>({})

  const addPatient = useMutation<{ message: string }, Error, Payload>(
    async (payload) => {
      try {
        const res = await privateRequest.post('admin/patient', payload)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('patients')
        modal.remove()
      },
    },
  )
  const updatePatient = useMutation<{ message: string }, Error, PatientUpdatePayload>(
    async (payload) => {
      try {
        const res = await privateRequest.patch(`admin/patient`, payload)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('patients')
        modal.remove()
      },
    },
  )

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: patient?.name ?? '',
      phone: patient?.phone ?? '',
    }))
  }, [patient])

  const changeHandler = ({ target: { name, value } }: _ChangeHandlerEvent) => {
    if (name === 'consultationFee' || name === 'followupFee' || name === 'experienceInYear') {
      if (isNaN(Number(value))) return
    }
    if (name === 'phone' && value.length === 1 && value === '0') return
    if (name === 'phone' && value.length > 10) return

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const submitHandler = (e: _FormSubmitEvent) => {
    e.preventDefault()

    const payload: Payload = {
      dialCode: '+880',
      name: form.name,
      phone: form.phone,
    }

    if (!form.name || !form.phone) {
      setErrors((prev) => ({
        ...prev,
        name: !form.name ? 'Name is required' : '',
        phone: !form.phone ? 'Phone is required' : '',
      }))
      return
    }

    if (form.phone.length < 10) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Phone number must be 10 digits',
      }))
      return
    }

    if (patient?._id) {
      toast.promise(updatePatient.mutateAsync({ ...payload, id: patient?._id }), {
        loading: 'Updating patient...',
        success: (res) => res.message ?? 'Patient updated successfully',
        error: (err) => err.message ?? 'Something went wrong!',
      })
    } else {
      toast.promise(addPatient.mutateAsync(payload), {
        loading: 'Adding patient...',
        success: (res) => res.message ?? 'Patient added successfully',
        error: (err) => err.message ?? 'Something went wrong!',
      })
    }
  }

  return (
    <Modal
      title={title}
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <form onSubmit={submitHandler} className='flex flex-col gap-6'>
        <Input
          onChange={changeHandler}
          value={form.name}
          name='name'
          placeholder='Enter the full name'
          label='Full Name'
          helpText={errors.name}
          error={!!errors.name}
        />
        <Input
          onChange={changeHandler}
          value={form.phone}
          label='Phone'
          type='number'
          name='phone'
          placeholder='1XXXXXXXXX'
          prefix={<span className='mr-2 select-none'>+880</span>}
          helpText={errors.phone}
          error={!!errors.phone}
        />
        <Button disabled={addPatient.isLoading || updatePatient.isLoading} fullWidth>
          Submit
        </Button>
      </form>
    </Modal>
  )
})
