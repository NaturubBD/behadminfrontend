import clsx from 'clsx'
import React, { MouseEvent, MutableRefObject, useRef } from 'react'
import { MdClose } from 'react-icons/md'

type Props = {
  visible: boolean
  title?: string
  children: React.ReactNode
  onCancel?: () => void
  className?: string
}

export default function Modal({ visible, title, children, className = '', onCancel }: Props) {
  const refModal = useRef<HTMLDivElement | null>(null) as MutableRefObject<HTMLDivElement>

  const handleModalClick = (event: MouseEvent<HTMLDivElement>) => {
    if (refModal?.current.contains(event.target as Node)) {
      return
    }

    onCancel?.()
  }
  return (
    <div
      className={clsx(
        'overflow-y-auto fixed left-0 top-0 z-50 max-h-screen h-screen w-full flex duration-300 transition-all bg-black bg-opacity-70 backdrop-blur-[3px] p-5',
        visible ? 'visible opacity-100' : 'invisible opacity-0',
      )}
      onClick={handleModalClick}
    >
      <div
        ref={refModal}
        className={clsx(
          'm-auto w-full bg-white rounded-lg p-3 md:p-4 pt-3 transition-transform',
          visible && 'modal-animate-top',
          className,
        )}
      >
        <div
          className={clsx('flex justify-between items-center text-lg font-semibold', {
            'border-b border-solid border-slate-200 pb-3 mb-6': !!title,
          })}
        >
          {title}{' '}
          <button
            className='ml-auto inline-flex text-slate-600 bg-primary-shade rounded-full h-7 w-7'
            onClick={onCancel}
          >
            <MdClose className='m-auto' size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

Modal.Footer = ({ children }: { children: React.ReactNode }) => (
  <div className='flex justify-between gap-2 mt-3 border-t border-solid border-slate-100 pt-4'>
    {children}
  </div>
)
