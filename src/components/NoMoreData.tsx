import clsx from 'clsx'
import { PropsWithChildren } from 'react'

type Props = {
  className?: string
}

export default function NoMoreData({
  children = 'No more data to load.',
  className = '',
}: PropsWithChildren<Props>) {
  return (
    <div className={clsx('text-danger mt-4 font-semibold text-center', className)}>{children}</div>
  )
}
