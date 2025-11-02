import NiceModal, { useModal } from '@ebay/nice-modal-react'
import moment from 'moment'
import { useEffect, useState } from 'react'
import 'react-calendar/dist/Calendar.css'
import 'react-date-picker/dist/DatePicker.css'
import { LooseValue } from 'react-date-picker/dist/cjs/shared/types'
import { toast } from 'react-hot-toast'
import { useMutation, useQueryClient } from 'react-query'

import DatePickerInput from 'components/DatepickerInput'
import FileUpload from 'components/FileUpload'
import Button from 'components/form/button'
import Input from 'components/form/input'
import Select from 'components/form/select'
import Modal from 'components/modal'

import { privateRequest } from 'config/axios.config'
import { errorHandler } from 'utils/errorHandler'
import { assetUrl } from 'utils/url'

type State = {
  title: string
  body: string
  type: Option
  castingType: Option
  scheduledAt: Date
  banner: File | null
  bannerBase64?: string
}

type Payload = {
  id?: string
  title: string
  body: string
  type: string
  castingType: string
  scheduledAt?: Date
  banner?: {
    base64String: string
    fileExtension: string
  }
}

const types: Option[] = [
  {
    label: 'Basic',
    value: 'basic',
  },
  {
    label: 'Standard',
    value: 'standard',
  },
]

const castTypes: Option[] = [
  {
    label: 'Scheduled',
    value: 'scheduled',
  },
  {
    label: 'Now',
    value: 'now',
  },
]

export default NiceModal.create(({ _id, data }: { _id?: string; data?: NotificationData }) => {
  const modal = useModal()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<State>({
    title: '',
    body: '',
    type: types[0],
    castingType: castTypes[0],
    scheduledAt: moment().add(1, 'days').toDate(),
    banner: null,
  })

  const [errors, setErrors] = useState<{
    title?: string
    body?: string
    type?: string
    castingType?: string
    scheduledAt?: string
    banner?: string
  }>({})

  useEffect(() => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        title: data.title,
        body: data.body,
        type: types.find((type) => type.value === data.type) ?? types[0],
        castingType:
          castTypes.find((type) => type.value === data.status) ?? data?.scheduledAt
            ? castTypes[0]
            : castTypes[1],
        scheduledAt: moment(data.scheduledAt).toDate(),
      }))
    }
  }, [data])

  const addMutation = useMutation<{ message: string }, Error, Payload>(
    async (payload) => {
      try {
        const res = await privateRequest.post('admin/notification', payload)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
        modal.remove()
      },
    },
  )
  const updateMutation = useMutation<{ message: string }, Error, Payload>(
    async (payload) => {
      try {
        const res = await privateRequest.patch('admin/notification', payload)
        return res.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
        modal.remove()
      },
    },
  )

  const changeHandler = ({ target: { name, value, files, type } }: _ChangeHandlerEvent) => {
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
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
  }

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

  const dateHandler = (e: LooseValue, name: string) => {
    setForm({
      ...form,
      [name]: e,
    })
  }

  const submitHandler = (e: _FormSubmitEvent) => {
    e.preventDefault()
    if (
      (form.type.value === 'standard' && !form.banner && !data?.banner) ||
      !form.title ||
      !form.body ||
      !form.type ||
      !form.castingType ||
      (form.castingType.value === 'scheduled' && !form.scheduledAt)
    ) {
      setErrors((prev) => ({
        ...prev,
        title: !form.title ? 'Title is required' : '',
        body: !form.body ? 'Body is required' : '',
        type: !form.type ? 'Type is required' : '',
        castingType: !form.castingType ? 'Casting Type is required' : '',
        scheduledAt:
          form.castingType.value === 'scheduled' && !form.scheduledAt
            ? 'Scheduled At is required'
            : '',
        banner:
          form.type.value === 'standard' && !form.banner && !data?.banner
            ? 'Banner is required'
            : '',
      }))
      return
    }

    const payload: Payload = {
      title: form.title,
      body: form.body,
      type: form.type.value,
      castingType: form.castingType.value,
      ...(form.castingType.value !== 'now' && {
        scheduledAt: form.scheduledAt,
      }),
    }

    if (form.bannerBase64) {
      const extension = form.bannerBase64
        ?.toString()
        .split(',')[0]
        ?.replaceAll(';base64', '')
        ?.replaceAll('data:', '')
      const base64 = form.bannerBase64?.toString().split(',')[1]

      payload.banner = {
        base64String: base64,
        fileExtension: extension,
      }
    }

    if (_id) {
      payload.id = _id
      toast.promise(updateMutation.mutateAsync(payload), {
        loading: 'Updating notification...',
        success: (res) => res.message ?? 'Notification updated successfully',
        error: (err) => err.message ?? 'Failed to update notification',
      })
      return
    }

    toast.promise(addMutation.mutateAsync(payload), {
      loading: 'Adding notification...',
      success: (res) => res.message ?? 'Notification added successfully',
      error: (err) => err.message ?? 'Failed to add notification',
    })
  }

  return (
    <Modal
      title={`${_id ? 'Update' : 'Add'} Push Notification`}
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <form onSubmit={submitHandler} className='flex flex-col gap-4'>
        <Input
          name='title'
          value={form.title}
          onChange={changeHandler}
          label='Notification Title'
          placeholder='Enter notification title'
          error={!!errors.title}
          helpText={errors.title}
        />
        <Input
          label='Notification Body'
          placeholder='Enter notification body'
          name='body'
          value={form.body}
          onChange={changeHandler}
          multiline
          rows={4}
          error={!!errors.body}
          helpText={errors.body}
        />
        <Select
          label='Casting Type'
          placeholder='Select casting type'
          name='castingType'
          value={form.castingType}
          onChange={changeHandler}
          options={castTypes}
          error={!!errors.castingType}
          helpText={errors.castingType}
        />

        {form.castingType.value === 'scheduled' && (
          <DatePickerInput
            label='Schedule At'
            value={form.scheduledAt}
            onChange={dateHandler}
            name='scheduledAt'
            error={!!errors.scheduledAt}
            helpText={errors.scheduledAt}
          />
        )}
        <Select
          label='Notification Type'
          placeholder='Select notification type'
          name='type'
          value={form.type}
          onChange={changeHandler}
          options={types}
        />
        {form.type.value === 'standard' && (
          <FileUpload
            labelClassName='h-64'
            name='banner'
            value={form.banner}
            defaultValue={data?.banner && `${assetUrl}${data?.banner}`}
            onChange={changeHandler}
            label='Notification Banner'
            placeholder='Enter notification banner'
            error={!!errors.banner}
            helpText={errors.banner}
          />
        )}
        {/* <DateRangePickerInput value={date} label='Valid From' onChange={setDate} /> */}
        <Button disabled={addMutation.isLoading} fullWidth>
          Submit
        </Button>
      </form>
    </Modal>
  )
})
