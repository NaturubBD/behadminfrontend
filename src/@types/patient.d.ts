type PatientsResponse = {
  docs: Patient[]
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

type Patient = {
  _id: string
  phone: string
  createdAt: Date
  dateOfBirth: Date
  deviceTokens: [null]
  dialCode: '+880'
  email: null
  favoriteDoctors: ['646bb3f7349288890b50a966']
  gender: Gender
  isVerified: true
  name: string
  parent: null
  patientType: 'main'
  photo: string | null
  relation: 'none'
  status: PatientStatus
  totalConsultationCount: 0
  updatedAt: Date
  weight: string
}

type PatientStatus = 'waitingForApproval' | 'activated' | 'disabled'
