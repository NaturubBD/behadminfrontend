type SubAdminResponse = {
  docs: SubAdmin[]
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

type SubAdmin = {
  _id: string
  phone: string
  __v: number
  createdAt: Date
  dialCode: string
  name: null
  photo: null
  status: string
  updatedAt: Date
  role: AdminRole
}
