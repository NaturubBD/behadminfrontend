import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Input from 'components/form/input'
import Modal from 'components/modal'

export default NiceModal.create(() => {
  // Use a hook to manage the modal state
  const modal = useModal()

  const submitHanlder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    modal.hide()
  }

  return (
    <Modal
      title='Edit Patient’s Info'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <form onSubmit={submitHanlder} className='flex flex-col gap-6'>
        <Input placeholder='Enter the full name' label='Full Name' />
        <Input placeholder='Enter the phone number' label='Phone Number' />
        <Button fullWidth>Update Changes</Button>
      </form>
    </Modal>
  )
})
