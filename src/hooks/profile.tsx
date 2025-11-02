import { privateRequest } from 'config/axios.config'
import { useQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

export const useGetProfile = ({ onSuccess }: { onSuccess?: (data: User) => void }) =>
  useQuery<User, Error>(
    'get-profile',
    async () => {
      try {
        const res = await privateRequest.get('admin/profile')
        return res.data.user
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      onSuccess: (data) => onSuccess?.(data),
    },
  )
