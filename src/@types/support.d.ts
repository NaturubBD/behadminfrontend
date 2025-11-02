type SupportRequestResponse = {
  docs: SupportRequest[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: null
  nextPage: number
}

type SupportRequest = {
  _id: string
  user: {
    _id: string
    phone: string
    name: string
    photo: string
    totalConsultationCount: number
  }
  admin: {
    _id: string
    phone: string
    name: string
    photo: null | string
  }
  status: 'pending' | 'inProgress' | 'active'
  subject: string
  createdAt: Date
  resolveNote: string
}

type SupportMessageResponse = {
  docs: SupportMessage[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: null
  nextPage: null
}

type SupportMessage = {
  _id: string
  support: string
  senderType: string
  contentType: MessageContentType
  content: string
  createdAt: Date
  updatedAt: Date
  __v: number
  sender: Sender
}

type MessageContentType = 'attachment' | 'text'

type Sender = {
  _id: string
  name: string
  dialCode: string
  phone: string
  email: null | string
  photo: null | string
  password?: null
  branch?: string
  role?: string
  status: string
  createdAt: Date
  updatedAt: Date
  __v: number
  totalConsultationCount?: number
  dateOfBirth?: Date
  favoriteDoctors?: string[]
  gender?: string
  isVerified?: boolean
  parent?: null
  patientType?: string
  relation?: string
  weight?: string
  deviceTokens?: string[]
}
