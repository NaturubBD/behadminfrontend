import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import { useRef } from 'react'
import Modal from '.'

type Props = {
  title?: string
  phase?: ButtonColorType
  description?: string
  header?: string
  buttonText?: string
  icon?: string
  isNoteRequired?: boolean
}

export default NiceModal.create(
  ({
    title,
    phase = 'primary',
    buttonText = 'Confirm',
    description,
    header,
    icon,
    isNoteRequired = false,
  }: Props) => {
    const modal = useModal()

    const noteRef = useRef<HTMLTextAreaElement>(null)

    return (
      <Modal
        title={title}
        visible={modal.visible}
        onCancel={() => modal.remove()}
        className='max-w-lg'
      >
        {icon && <img className='mb-4' src={icon} alt='' />}
        <h2 className='text-[18px] font-medium leading-8'>{header}</h2>
        <p>{description}</p>
        {isNoteRequired && (
          <textarea
            ref={noteRef}
            className='w-full border border-[#CECECE] rounded-lg mt-5 p-3'
            placeholder='Write a note...'
          />
        )}
        <div className='flex gap-5 justify-between mt-10'>
          <Button
            fullWidth
            onClick={() => {
              modal.reject()
              modal.hide()
            }}
            size='sm'
            color='default'
          >
            Cancel
          </Button>
          <Button
            fullWidth
            onClick={() => {
              modal.resolve(isNoteRequired ? noteRef.current?.value : undefined)
              modal.remove()
            }}
            size='sm'
            color={phase}
          >
            {buttonText}
          </Button>
        </div>
      </Modal>
    )
  },
)
