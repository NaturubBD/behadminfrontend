import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import { AuthContext } from 'context/AuthContext'
import AuthLayout from 'layout/AuthLayout'
import { SyntheticEvent, useContext, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Navigate } from 'react-router-dom'
import { errorHandler } from 'utils/errorHandler'

type Form = {
  dialCode: string
  phone: string
}

export default function LoginPage() {
  const { setTraceId, traceId } = useContext(AuthContext)
  const [form, setForm] = useState<Form>({
    dialCode: '+880',
    phone: '',
  })

  const loginMutation = useMutation<{ traceId: string; message: string }, Error, Form>(
    async (payload) => {
      try {
        const res = await privateRequest.post('/admin/auth/request', payload)
        return res.data.data
      } catch (err: any) {
        errorHandler(err)
      }
    },
    {
      onSuccess: (data) => {
        if (!data.traceId) return
        localStorage.setItem('traceId', data.traceId)
        setTraceId(data.traceId)
      },
    },
  )

  const changeHandler = (e: any) => {
    if (e.target.name === 'phone' && e.target.value.length === 1 && e.target.value === '0') return
    if (e.target.name === 'phone' && e.target.value.length > 10) return
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()
    if (!form.dialCode || !form.phone) return toast.error('Please fill all the fields')

    toast.promise(loginMutation.mutateAsync(form), {
      loading: 'Logging in...',
      success: (res) => res.message || 'Logged in successfully',
      error: (err) => err?.message || 'Failed to login',
    })
  }

  if (traceId) return <Navigate to='/verify' />

  return (
    <AuthLayout title='Log into your account.' description='Please provide a correct phone number'>
      <form className='flex flex-col gap-6' onSubmit={onSubmit}>
        <Input
          onChange={changeHandler}
          value={form.phone}
          label='Phone'
          type='number'
          name='phone'
          placeholder='1XXXXXXXXX'
          prefix={<span className='mr-2 select-none'>+880</span>}
        />
        <div className='flex justify-end'>
          <Button disabled={loginMutation.isLoading} className='!px-10'>
            Log In
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
