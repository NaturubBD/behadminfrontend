import NiceModal, { useModal } from '@ebay/nice-modal-react'
import FileUpload from 'components/FileUpload'
import Button from 'components/form/button'
import Input from 'components/form/input'
import Modal from 'components/modal'
import { privateRequest } from 'config/axios.config'
import { useEffect, useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

type Payload = {
  title: string
  description: string
  attachment: {
    base64String: string
    fileExtension: string
  }
}

type State = {
  title: string
  description: string
  banner: File | null
  bannerBase64: string
}

type Errors = {
  title?: string
  description?: string
  banner?: string
}

export default NiceModal.create(() => {
  const modal = useModal()

  const queryClient = useQueryClient()

  const [form, setForm] = useState<State>({
    title: '',
    description: '',
    bannerBase64: '',
    banner: null,
  })
  const [errors, setErrors] = useState<Errors>({
    banner: '',
    description: '',
    title: '',
  })

  const addPromoBannerMutation = useMutation<{ message: string }, Error, Payload>(
    async (payload) => {
      try {
        const res = await privateRequest.post('admin/banner', payload)
        return res.data
      } catch (err) {
        errorHandler(err)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('banners')
        modal.remove()
      },
    },
  )

  useEffect(() => {
    if (form.banner) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setForm((prev) => ({
          ...prev,
          bannerBase64: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(form.banner)
    }
  }, [form.banner])

  const changeHandler = ({ target: { name, value, files, type } }: _ChangeHandlerEvent) => {
    if (type === 'file') {
      setForm({
        ...form,
        [name]: files ? files[0] : null,
      })
      return
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

  const submitHandler = (e: _FormSubmitEvent) => {
    e.preventDefault()
    if (!form.banner || !form.title || !form.description) {
      setErrors((prev) => ({
        ...prev,
      }))
      return
    }

    const payload: Payload = {
      title: form.title,
      description: form.description,
      attachment: {
        base64String: form.bannerBase64?.toString().split(',')[1],
        fileExtension: form.bannerBase64
          ?.toString()
          .split(',')[0]
          ?.replaceAll(';base64', '')
          ?.replaceAll('data:', ''),
      },
    }

    toast.promise(addPromoBannerMutation.mutateAsync(payload), {
      loading: 'Adding promo banner...',
      success: (res) => res.message ?? 'Promo banner added successfully',
      error: (err) => err.message ?? 'Failed to add promo banner',
    })
  }

  return (
    <Modal
      title='Create Promo Banner'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <form onSubmit={submitHandler}>
        <Input
          onChange={changeHandler}
          name='title'
          value={form.title}
          label='Title'
          placeholder='Enter title'
          helpText={errors.title}
          error={!!errors.title}
        />
        <Input
          onChange={changeHandler}
          name='description'
          value={form.description}
          label='Description'
          placeholder='Enter description'
          helpText={errors.description}
          error={!!errors.description}
        />
        <FileUpload
          name='banner'
          value={form.banner}
          onChange={changeHandler}
          label='Banner'
          placeholder='Enter banner'
          error={!!errors.banner}
          helpText={errors.banner}
        />
        <Button className='mt-10' fullWidth>
          Submit
        </Button>
      </form>
    </Modal>
  )
})
