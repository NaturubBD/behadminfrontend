import { privateRequest } from 'config/axios.config'
import { useQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

export const useGetSingleAdmin = (id?: string) =>
  useQuery<SubAdmin, Error>(
    ['get-single-subAdmin', id],
    async () => {
      try {
        const res = await privateRequest.get(`admin/subAdmin/${id}`)
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      enabled: !!id,
    },
  )
