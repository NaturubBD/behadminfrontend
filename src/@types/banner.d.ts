type BannerResponse = {
  docs: BannerData[]
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

type BannerData = {
  _id: string
  title: string
  description: string
  file: string
  status: string
  createdAt: Date
  updatedAt: Date
}
