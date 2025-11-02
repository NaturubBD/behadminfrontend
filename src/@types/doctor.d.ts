type DoctorsResponse = {
  docs: DoctorsDoc[]
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

type DoctorsDoc = {
  _id: string
  phone: string
  __v: number
  about: null | string
  availabilityStatus: AvailabilityStatus
  averageConsultancyTime: number
  averageRating: number
  averageResponseTime: number
  bmdcCode: null | string
  consultationFee: number
  createdAt: Date
  deviceTokens?: Array<null | string>
  dialCode: string
  experienceInYear: number
  followupFee: number
  gender: Gender
  name: null | string
  photo: null | string
  ratingCount: number
  signature?: null
  status: DoctorStatus
  totalConsultationCount?: number
  updatedAt: Date
  hospital?: Hospital
  specialty?: Specialty
  experiences: Experience[]
  totalPatientCount?: number
}

type DoctorDetails = {
  _id: string
  name: string
  dialCode: string
  phone: string
  photo: null | string
  signature: null
  specialty: Specialty
  hospital: Hospital
  gender: string
  experienceInYear: number
  bmdcCode: string
  consultationFee: number
  consultationFeeUsd: number
  followupFee: number
  about: string
  deviceTokens: string[]
  status: string
  availabilityStatus: AvailabilityStatus
  ratingCount: number
  averageRating: number
  averageConsultancyTime: number
  averageResponseTime: number
  totalConsultationCount: number
  balance: number
  createdAt: Date
  updatedAt: Date
  __v: number
  experiences: Experience[]
}

type AvailabilityStatus = 'offline' | 'online'

type Experience = {
  _id: string
  doctor: string
  hospitalName: string
  designation: string
  department: string
  startDate: Date
  endDate: Date
  currentlyWorkingHere: boolean
  __v: number
  createdAt: Date
  updatedAt: Date
}

type Hospital = {
  _id: string
  name: string
  address: string
  location: Location
  description: string
  status: string
  createdAt: Date
  updatedAt: Date
  __v: number
}

type Location = {
  type: string
  coordinates: number[]
}

type Specialty = {
  _id: string
  title: string
  symptoms: string
  status: string
  createdAt: Date
  updatedAt: Date
  __v: number
}

type DoctorStatus = 'waitingForApproval' | 'activated' | 'disabled'
