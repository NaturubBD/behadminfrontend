import { useEffect } from 'react'
import { loginRedirectUrl } from 'utils/url'

const UnAuthorized = () => {
  useEffect(() => {
    document.title = 'UnAuthorized'
  }, [])

  const retryLogin = () => {
    localStorage.removeItem('token')
    window.location.replace(loginRedirectUrl)
  }

  return (
    <div className='h-screen w-full flex flex-col items-center justify-center'>
      You Are UnAuthorized To Access This Page{' '}
      <p className='text-red-500 cursor-pointer mt-1' onClick={retryLogin}>
        Try to login again
      </p>
    </div>
  )
}

export default UnAuthorized
