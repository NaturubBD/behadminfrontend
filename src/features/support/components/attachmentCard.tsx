import { useState } from 'react'
import { MdClose } from 'react-icons/md'
import { assetUrl } from 'utils/url'

type Props = {
  row: SupportMessage
}

export function AttachmentCard({ row: { contentType, content } }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleImageClick = () => {
    if (contentType === 'attachment') {
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      {contentType === 'attachment' ? (
        <>
          <div className='overflow-hidden'>
            <img
              className='max-w-full w-40 cursor-pointer rounded-md'
              src={assetUrl + content}
              onClick={handleImageClick}
            />
          </div>
          {isModalOpen && (
            <div className='fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
              <div className='max-w-7xl mx-auto'>
                <img className='max-w-full h-auto' src={assetUrl + content} alt='Image' />
                <button
                  className='absolute bg-black h-12 flex justify-center items-center w-12 rounded-full top-4 right-4 text-white'
                  onClick={closeModal}
                >
                  <MdClose size={25} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className='text-sm'>{content}</p>
      )}
    </>
  )
}
