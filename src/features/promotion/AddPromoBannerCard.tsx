import { useModal } from '@ebay/nice-modal-react'
import { BsUpload } from 'react-icons/bs'
import addPromoBannerModal from './add-promo-banner.modal'

export default function AddPromoBannerCard() {
  const addBanner = useModal(addPromoBannerModal)
  return (
    <div
      onClick={() => addBanner.show()}
      className='border-2 cursor-pointer border-primary rounded-xl px-10 h-52 flex flex-col justify-center items-center text-center gap-2'
    >
      <BsUpload className='text-gray-2' size={15} />
      <h2 className='text-gray-2 font-medium text-base'>Upload</h2>
      <p className='text-gray-2 font-medium text-sm'>
        1000px*300px size. Format will be .jpg, .jpeg, .png
      </p>
    </div>
  )
}
