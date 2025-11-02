import clsx from 'clsx'

interface Props {
  className?: string
}

const Skeleton = ({ className = '' }: Props) => {
  const classNames = clsx('rounded-lg bg-light-gray shadow-sm animate-pulse', className)

  return <div className={classNames} />
}

export default Skeleton
