import clsx from 'clsx'
import React from 'react'

type Props = {
  children: React.ReactNode
  open?: boolean
  sx?: React.CSSProperties
}

export default function Backdrop({ children, open: isOpen, sx }: Props) {
  return (
    <div
      style={sx}
      className={clsx(
        'fixed left-0 top-0 h-screen w-full text-dark bg-slate-100 dark:bg-dark grid place-items-center',
        isOpen ? 'visible opacity-100' : 'invisible opacity-0',
      )}
    >
      {children}
    </div>
  )
}
