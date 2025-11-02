type Promo = {
  _id: string
  code: string
  discount: number
  minimumPurchase: number
  maximumDiscount: number
  validFrom: Date
  validTill: Date
  discountFor: DiscountFor
  selectedUsers: string[]
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
  __v: number
}

type DiscountFor = 'all' | 'selectedUsers'
