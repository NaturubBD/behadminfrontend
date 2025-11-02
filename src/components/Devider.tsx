import clsx from 'clsx'

type Props = {
  className?: string
}

export default function Devider({ className = '' }: Props) {
  return <div className={clsx('h-10', className)} />
}
