import queryString from 'query-string'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

const initState: State = {
  user: {},
} as AuthState

export const AuthContext = createContext<AuthState>(initState as AuthState)
export const useUser = () => useContext(AuthContext)

type State = {
  user?: User
  token?: string
  traceId?: string
}

const AuthContextProvider = ({ children }: PropsWithChildren<unknown>) => {
  const { token } = queryString.parse(location.search)
  const [auth, setAuth] = useState<State>({
    user: undefined,
    token: localStorage.getItem('token') ?? (token as string),
    traceId: localStorage.getItem('traceId') ?? (token as string),
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token as string)
    }
  }, [token])

  const [isDrawerShow, setDrawerShow] = useState<boolean>(false)

  const setUser = (user: User) => {
    setAuth((prev) => ({ ...prev, user: user }))
  }

  const setToken = (token: string) => {
    setAuth((prev) => ({ ...prev, token }))
  }

  const setTraceId = (traceId: string) => {
    setAuth((prev) => ({ ...prev, traceId }))
  }

  const logOut = async () => {
    // toast.promise(privateRequest.post('user/logout'), {
    //   loading: 'Logging out...',
    //   success: () => {
    //     localStorage.removeItem('token')
    //     window.location.replace(loginRedirectUrl)
    //     return 'Logged out successfully'
    //   },
    //   error: 'Failed to log out',
    // })
    // setToken('')
    localStorage.removeItem('token')
    toast.success('You have successfully logged out. Thank you for using our admin panel!')
    window.location.replace('/')
  }

  return (
    <AuthContext.Provider
      value={{ ...auth, setUser, setToken, setTraceId, logOut, isDrawerShow, setDrawerShow }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
