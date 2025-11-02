type WithdrawalResponse = {
  docs: Withdrawal[]
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

type WithdrawalType = 'confirmed' | 'pending' | 'declined'

type Withdrawal = {
  _id: string
  transactionType: TransactionType
  criteria: string
  amount: number
  note: string
  status: WithdrawalType
  transferredBy: string
  createdAt: Date
  doctor: {
    about: string
    bmdcCode: string
    dialCode: string
    name: string
    phone: string
    photo: string
    _id: string
  }
  account: Account
}

type Account = {
  _id: string
  accountType: string
  bankName: string
  branch: string
  accountName: string
  accountNumber: string
}

type TransactionType = 'debit' | 'credit'

type StatisticsResponse = {
  totalPendingWithdrawal: number
  totalConfirmedWithdrawal: number
}
