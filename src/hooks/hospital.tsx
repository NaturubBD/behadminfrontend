import { privateRequest } from 'config/axios.config'
import { useQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

export const useAllHospitalsOptions = () =>
  useQuery<Option[], Error>('all-hospitals-options', async () => {
    try {
      const res = await privateRequest.get('admin/hospital?limit=-1')
      return res.data.data.docs?.map((el: any) => ({
        label: el.name,
        value: el._id,
      }))
    } catch (error) {
      errorHandler(error)
    }
  })
