import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import { useUser } from 'context/AuthContext'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'
import { assetUrl } from 'utils/url'

export default function ProfilePage() {
  const { user } = useUser()
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<{
    name: string
    email: string
  }>({
    email: '',
    name: '',
  })

  useEffect(() => {
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
    })
  }, [user])

  const changeHandler = (e: _ChangeHandlerEventInput) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const uploadAvatarMutation = useMutation<{ message: string }, Error, FormData>(
    (payload) =>
      privateRequest.post('admin/profile/uploadProfilePhoto', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    {
      onError: () => {
        setFile(undefined)
      },
    },
  )

  const uploadAvatar = (e: _ChangeHandlerEventInput) => {
    const file = e.target.files?.[0]

    if (!file) return

    const size = Math.floor(file.size / 1000)
    if (size > 1024 * 5) {
      toast.error('File size does not allow more than 5 MB')
      return
    }

    setFile(file)
    const formData = new FormData()
    formData.append('attachment', file)

    uploadAvatarMutation.mutate(formData)
  }

  const updateProfile = useMutation<
    { message: string },
    Error,
    {
      name: string
      email: string
    }
  >((payload) => privateRequest.patch('admin/profile/update', payload), {
    onError: () => {
      setForm({
        email: user?.email ?? '',
        name: user?.name ?? '',
      })
    },
  })

  const handleSubmit = (e: _FormSubmitEvent) => {
    e.preventDefault()

    toast.promise(updateProfile.mutateAsync(form), {
      loading: 'Updating...',
      success: (res) => res.message ?? 'Profile updated successfully',
      error: (err) => err.message ?? 'Profile update failed',
    })
  }

  const [file, setFile] = useState<File>()
  const avatar = (file && URL.createObjectURL(file)) || (user?.photo && assetUrl + user?.photo)

  return (
    <div>
      <div className='flex items-center gap-5 my-10'>
        <div className='h-20 w-20 rounded-full bg-slate-200 overflow-hidden'>
          {avatar && <img className='w-full h-full object-cover' src={avatar} />}
        </div>
        <Button
          onClick={() => avatarInputRef.current?.click()}
          className='!px-10'
          color='success'
          variant='outlined'
          size='sm'
          disabled={uploadAvatarMutation.isLoading}
        >
          Upload
          <input
            className='absolute opacity-0 invisible'
            onChange={uploadAvatar}
            type='file'
            ref={avatarInputRef}
          />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className='max-w-xl flex flex-col gap-5 mb-6'>
        <Input label='Name' value={form.name} name='name' onChange={changeHandler} />
        <Input
          label='Email'
          value={form.email}
          name='email'
          type='email'
          onChange={changeHandler}
        />
        <Button disabled={updateProfile.isLoading}>Submit</Button>
      </form>
    </div>
  )
}
