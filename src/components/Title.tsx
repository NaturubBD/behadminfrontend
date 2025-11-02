import clsx from 'clsx'
import { PropsWithChildren } from 'react'

type Props = {
  className?: string
  variant?: 'header' | 'card_title'
}

export default function Title({
  className = '',
  children,
  variant = 'header',
}: PropsWithChildren<Props>) {
  return (
    <div
      className={clsx(className, {
        'text-lg font-semibold': variant === 'header',
        'text-base font-medium': variant === 'card_title',
      })}
    >
      {children}
    </div>
  )
}
