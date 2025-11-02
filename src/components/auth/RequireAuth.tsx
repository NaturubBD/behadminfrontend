import { Loader } from 'components/Loader'
import { AuthContext } from 'context/AuthContext'
import { useGetProfile } from 'hooks/profile'
import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import UnAuthorized from './UnAuthorized'

const RequireAuth = () => {
  const { setUser } = useContext(AuthContext)

  const { isLoading, isError } = useGetProfile({ onSuccess: (data) => setUser(data) })

  if (isLoading) {
    return <Loader className='h-screen' />
  }

  if (isError) {
    return <UnAuthorized />
  }

  return <Outlet />
}

export default RequireAuth
