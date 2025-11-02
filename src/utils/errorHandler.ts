import axios from 'axios'

export const errorHandler = (error: any, customErrMessage?: string) => {
  if (axios.isAxiosError(error)) {
    // can access response property
    throw new Error(error.response?.data?.message)
  } else {
    // other errors
    throw new Error(customErrMessage ?? 'Something went wrong')
  }
}
