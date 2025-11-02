export const StatusColorFinder = (type: string): string => {
  if (['credit', 'confirmed'].includes(type)) {
    return 'text-success'
  } else if (['debit'].includes(type)) {
    return 'text-danger'
  } else if (['pending'].includes(type)) {
    return 'text-warning'
  }

  return 'text-info'
}
