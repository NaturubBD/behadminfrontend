type NotificationResponse = {
  docs: NotificationData[]
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

type NotificationData = {
  _id: string
  title: string
  body: string
  banner: string
  audience: string
  audienceId: null
  criteria: string
  notifiableId: null
  type: 'basic' | 'standard'
  scheduledAt: Date
  status: 'sent' | 'scheduled'
  createdAt: Date
  updatedAt: Date
  __v: 0
}
