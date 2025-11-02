import { privateRequest } from 'config/axios.config'
import { useQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

export const useGetSinglePatient = (id?: string) =>
  useQuery<Patient, Error>(
    ['get-single-patient', id],
    async () => {
      try {
        const res = await privateRequest.get(`admin/patient/${id}`)
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      enabled: !!id,
    },
  )
