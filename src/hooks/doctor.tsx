import { privateRequest } from 'config/axios.config'
import { useQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

export const useGetSingleDoctor = (id?: string) =>
  useQuery<DoctorDetails, Error>(
    ['get-single-doctor', id],
    async () => {
      try {
        const res = await privateRequest.get(`admin/doctor/${id}`)
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      enabled: !!id,
      refetchOnMount: true, // Ensures fresh data when component mounts
      refetchOnWindowFocus: true, // Refetch when window is focused
      cacheTime: 0, // Disables cache persistence
      staleTime: 0, // Forces fresh data every time
    },
  )
