type AuthState = {
  user?: User
  traceId?: string
  token?: string
  isDrawerShow: boolean
  setDrawerShow: React.Dispatch<React.SetStateAction<boolean>>
  setUser: (user: User) => void
  setToken: (token: string) => void
  setTraceId: (traceId: string) => void
  logOut: () => void
}

type User = {
  email: null | string
  password: null | string
  branch: null | string
  role: AdminRole
  _id: string
  phone: string
  __v: number
  dialCode: '+880'
  name: null | string
  photo: null | string
  status: 'activated'
  createdAt: Date
  updatedAt: Date
  username: string
}

type AdminRole = 'superAdmin' | 'eyeBuddyAdmin' | 'hospitalAdmin' | 'customerSupportManager'
