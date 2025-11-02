import { privateRequest } from 'config/axios.config'
import { State } from 'features/promotion/add-promo.modal'
import { UpdatePayloadState } from 'features/promotion/update-promo.modal'
import { errorHandler } from 'utils/errorHandler'

export const addPromo = async (promo: State) => {
  try {
    const res = await privateRequest.post('admin/promo', promo)
    return res.data
  } catch (error) {
    errorHandler(error)
  }
}

export const updatePromo = async (promo: UpdatePayloadState) => {
  try {
    const res = await privateRequest.patch('admin/promo', promo)
    return res.data
  } catch (error) {
    errorHandler(error)
  }
}
