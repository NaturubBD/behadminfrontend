import clsx from 'clsx'
import { PropsWithChildren } from 'react'

type Props = {
  message: string
  className?: string
  containerClass?: string
}

export default function Tooltip({
  children,
  message,
  className = '',
  containerClass = '',
}: PropsWithChildren<Props>) {
  return (
    <div className={clsx('group cursor-pointer relative inline-block', className)}>
      <div className={clsx('pointer-events-none', containerClass)}>{children}</div>
      <div className='opacity-0 min-w-28 bg-primary font-medium text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 bottom-full left-1/2 -translate-x-1/2 px-3 pointer-events-none'>
        {message}
        <svg
          className='absolute text-black h-2 w-full left-0 top-full'
          x='0px'
          y='0px'
          viewBox='0 0 255 255'
          xmlSpace='preserve'
        >
          <polygon className='fill-current' points='0,0 127.5,127.5 255,0' />
        </svg>
      </div>
    </div>
  )
}
