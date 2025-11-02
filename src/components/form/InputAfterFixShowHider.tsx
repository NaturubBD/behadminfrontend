import { BsEye, BsEyeSlash } from 'react-icons/bs'

type Props = {
  type: 'eye'
  onClick: () => void
  isVisible: boolean
}

export default function InputAfterFixShowHider({ isVisible, onClick, type }: Props) {
  if (type === 'eye') {
    return (
      <span onClick={onClick}>
        {isVisible ? (
          <BsEye size={25} className='text-dark mr-3 cursor-pointer' />
        ) : (
          <BsEyeSlash size={25} className='text-gray mr-3 cursor-pointer' />
        )}
      </span>
    )
  }
  return null
}
