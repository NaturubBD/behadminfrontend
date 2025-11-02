import OTPInput from 'components/OTPInput'
import Button from 'components/form/button'
import { privateRequest } from 'config/axios.config'
import { AuthContext } from 'context/AuthContext'
import AuthLayout from 'layout/AuthLayout'
import { SyntheticEvent, useContext, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useMutation } from 'react-query'
import { Navigate } from 'react-router-dom'
import { errorHandler } from 'utils/errorHandler'

type Payload = {
  code: string
  traceId: string
}

export default function VerifyPage() {
  const { setToken, traceId, setUser } = useContext(AuthContext)
  const [code, setCode] = useState<string>('')

  const loginMutation = useMutation<{ token: string; message: string }, Error, Payload>(
    async (payload) => {
      try {
        const res = await privateRequest.post('admin/auth/verifyAuth', payload)
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: (data) => {
        if (!data.token) return
        localStorage.removeItem('traceId')
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setUser(undefined as any)
      },
    },
  )

  const changeHandler = (value: string) => {
    const rex = new RegExp(/\d/g)
    if (value?.length > 6) return
    setCode(value.match(rex)?.join('') ?? '')
  }

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault()

    const traceId = localStorage.getItem('traceId') ?? ''

    if (!code) {
      toast.error('Code is required')
      return
    }
    if (code.length < 6) {
      toast.error('Code must be 6 digits')
      return
    }

    const payload = {
      code: code,
      traceId,
    }

    toast.promise(loginMutation.mutateAsync(payload), {
      loading: 'Verifying...',
      success: (res) => res.message || 'Successfully verified',
      error: (err) => err.message || 'Failed to verify user',
    })
  }

  if (!traceId) return <Navigate to='/login' />

  return (
    <AuthLayout
      title='Phone verification'
      description='Please enter the 6 digit verification code that was sent to your phone number.'
    >
      <form className='flex flex-col gap-6' onSubmit={onSubmit}>
        {/* <Input value={code} onChange={changeHandler} /> */}
        <OTPInput
          value={code}
          onChange={changeHandler}
          numInputs={6}
          renderInput={(props) => <input {...props} placeholder='*' type='number' />}
          inputStyle={{
            height: '60px',
            borderRadius: '8px',
            background: '#F7F7F7',
            width: '100%',
            outlineColor: '#008541',
            border: 'none',
            fontWeight: 600,
            color: '#444',
            fontSize: '24px',
          }}
          containerStyle={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0.5rem',
          }}
        />
        <Button disabled={loginMutation.isLoading} className='!px-10'>
          Verify
        </Button>
      </form>
    </AuthLayout>
  )
}
