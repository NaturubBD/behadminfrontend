type WalletStatistics = {
  balance: {
    hospital: number
    doctors: number
    eyeBuddy: number
  }
  totalEarning: {
    hospital: number
    doctor: number
    eyeBuddy: number
  }
}

type Bank = {
  _id: string
  title?: string
  type?: 'bank' | 'mfs'
  status?: 'active'
  ownerType?: 'doctor' | string
  accountType?: 'bank' | 'mfs'
  owner?: string
  bankName?: string
  branch?: string
  district?: string
  accountName?: string
  accountNumber?: string
  createdAt: Date
  updatedAt: Date
  __v: 0
}

type WalletTransactionResponse = {
  docs: WalletTransaction[]
  totalDocs: number
  limit: number
  page: number
  totalPages: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number
  nextPage: null
}

type WalletTransaction = {
  _id: string
  ownerType: OwnerType
  owner?: DoctorDetails
  transactionType: TransactionType
  criteria: Criteria
  account: null | string
  amount: number
  note: string
  status: Status
  transferredBy: TransferredBy
  createdAt: Date
  updatedAt: Date
  __v: number
}

type Criteria = 'withdraw' | 'deposit'

type OwnerType = 'doctor' | 'eyeBuddy' | 'hospitalAdmin'

type TransactionType = 'debit' | 'credit'

type Status = 'confirmed' | 'pending'

type TransferredBy = 'cheque' | 'none' | 'bank'
