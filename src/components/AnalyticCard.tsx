import clsx from 'clsx'
import { PropsWithChildren } from 'react'
import Skeleton from './Skeleton'

type Props = {
  title: string | JSX.Element
  value?: string
  className?: string
  isLoading?: boolean
}

export default function AnalyticCard({
  title,
  value,
  children,
  className = '',
  isLoading = false,
}: PropsWithChildren<Props>) {
  return (
    <div className={clsx('bg-white p-6 rounded-xl', className)}>
      <h5 className='text-base text-gray flex items-center flex-wrap mb-3'>{title}</h5>
      {isLoading ? (
        <Skeleton className='h-4 w-28' />
      ) : (
        <h2 className='text-2xl text-dark font-semibold'>{value}</h2>
      )}
      {children}
    </div>
  )
}
