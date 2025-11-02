import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Button from 'components/form/button'
import Modal from 'components/modal'

export default NiceModal.create(({ data }: { data: Account }) => {
  // Use a hook to manage the modal state
  const modal = useModal()

  const infoRowClass = 'text-gray font-medium text-base py-1'

  return (
    <Modal
      title='Payment Info'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <div className='bg-primary-shade p-6'>
        <h3 className='text-2xl font-medium mb-4'>{data?.accountName}</h3>
        <table>
          <tr>
            <td className={infoRowClass}>Bank Name</td>
            <td className={infoRowClass}>{data?.bankName}</td>
          </tr>
          <tr>
            <td className={infoRowClass}>Branch</td>
            <td className={infoRowClass}>{data?.branch}</td>
          </tr>
          <tr>
            <td className={infoRowClass}>A/C</td>
            <td className={infoRowClass}>{data?.accountNumber}</td>
          </tr>
        </table>
      </div>
      <div className='flex gap-5 justify-between mt-10'>
        <Button
          fullWidth
          onClick={() => {
            modal.reject()
            modal.hide()
          }}
          color='default'
        >
          Cancel
        </Button>
        <Button
          fullWidth
          onClick={() => {
            modal.resolve()
            modal.hide()
          }}
          color='primary'
        >
          Done
        </Button>
      </div>
    </Modal>
  )
})
