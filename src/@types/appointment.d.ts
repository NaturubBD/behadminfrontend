type AppointmentResponse = {
  docs: Appointment[]
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

type AppointmentStatus = 'completed' | 'queued' | 'dropped' | 'late' | 'refunded'
type AppointmentType = 'regular'

type Appointment = {
  _id: string
  appointmentType: AppointmentType
  patient: {
    _id: string
    name: string
    dialCode: null
    photo: string
    phone: null
    gender: Gender
  }
  weight: number
  age: number
  reason: string
  description: string
  paymentId: string
  paymentMethod: string
  date: Date
  eyePhotos: string[]
  additionalFiles: string[]
  promoCode: null
  totalAmount: number
  fee: number
  vat: number
  discount: number
  grandTotal: number
  isPrescribed: boolean
  hasRating: boolean
  status: AppointmentStatus
  createdAt: Date
  doctor: [
    {
      _id: string
      phone: string
      about: string
      bmdcCode: string
      dialCode: string
      name: string
      photo: string
    },
  ]
}
