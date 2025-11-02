import NiceModal, { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import Modal from '../../components/modal'

type Props = {
  banks: Bank[]
  selected_id: string
}

export default NiceModal.create(({ banks, selected_id }: Props) => {
  // Use a hook to manage the modal state
  const modal = useModal()

  return (
    <Modal
      title='Select Bank'
      visible={modal.visible}
      onCancel={() => modal.remove()}
      className='max-w-2xl'
    >
      <div className='flex flex-col gap-4'>
        {banks.map((row) => (
          <div
            onClick={() => {
              modal.resolve(row)
              modal.remove()
            }}
            key={row._id}
            className='cursor-pointer p-4 border border-slate-200 hover:bg-primary-shade rounded-md'
          >
            <div className='flex items-center gap-4'>
              <div
                className={clsx('w-7 h-7 border-2 border-primary rounded-full', {
                  'bg-primary': row._id === selected_id,
                })}
              ></div>
              <div className='flex-1'>
                <p className='text-sm text-slate-500 mb-2 grid grid-cols-4 gap-5'>
                  Bank Name:{' '}
                  <span className='font-medium text-dark col-span-3'>
                    {row.bankName ?? row.title}
                  </span>
                </p>
                {row.accountName && (
                  <p className='text-sm text-slate-500 mb-2 grid grid-cols-4 gap-5'>
                    Account Name:{' '}
                    <span className='font-medium text-dark col-span-3'>{row.accountName}</span>
                  </p>
                )}
                {row.accountNumber && (
                  <p className='text-sm text-slate-500 mb-2 grid grid-cols-4 gap-5'>
                    Account No:{' '}
                    <span className='font-medium text-dark col-span-3'>{row.accountNumber}</span>
                  </p>
                )}
                {row.branch && (
                  <p className='text-sm text-slate-500 mb-2 grid grid-cols-4 gap-5'>
                    Branch: <span className='font-medium text-dark col-span-3'>{row.branch}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  )
})
