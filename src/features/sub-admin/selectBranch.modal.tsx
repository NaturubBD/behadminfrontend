import NiceModal, { useModal } from '@ebay/nice-modal-react'
import Modal from 'components/modal'
import { useAllHospitalsOptions } from 'hooks/hospital'

export default NiceModal.create(({ selected }: { selected?: Option }) => {
  const modal = useModal()

  const { data } = useAllHospitalsOptions()

  return (
    <Modal
      title='Select Branch'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <div className='max-h-96 overflow-y-auto'>
        {data?.map((el) => (
          <div
            onClick={() => {
              modal.resolve(el)
              modal.remove()
            }}
            key={el.value}
            className='border border-gray-4 cursor-pointer p-3 rounded-md mt-1'
          >
            {selected?.value === el.value ? (
              <span className='mr-2 text-lg text-primary select-none'>✓</span>
            ) : (
              <span className='mr-2 text-lg text-slate-300 select-none'>✓</span>
            )}
            {el.label}
          </div>
        ))}
      </div>
    </Modal>
  )
})
