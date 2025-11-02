import moment from 'moment'

export const dateFormatter = (date: Date) => moment(date).format('DD-MM-YYYY hh:mm A')

export const colorFinder = (status: WithdrawalType): ButtonColorType => {
  switch (status) {
    case 'confirmed':
      return 'success'
    case 'pending':
      return 'warning'
    case 'declined':
      return 'danger'
    default:
      return 'default'
  }
}

export const isAmountValid = (amount: string): boolean => {
  if (amount.match(/^0\d/g) !== null) return false
  if (amount.match(/^\d*\.?\d*$/g) === null) return false
  return true
}

export const amountFormatter = (amount?: number): string => {
  return amount ? Number(amount?.toFixed(2))?.toLocaleString() : '0'
}

export function maskEmail(email: string) {
  if (!email) return ''
  const atIndex = email.indexOf('@')
  const maskedEmail = email.substring(0, 3) + '*******' + email.substring(atIndex)
  return maskedEmail
}

export const tickFormatter = (value: number) =>
  value > 999 ? `${value / 1000}k Tk.` : `${value} Tk.`
