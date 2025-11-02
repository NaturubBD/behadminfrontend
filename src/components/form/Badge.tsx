import clsx from 'clsx'
import { BsPlus } from 'react-icons/bs'
import { Link } from 'react-router-dom'

type Props = {
  children: React.ReactNode
  className?: string
  to?: string
  color?: ButtonColorType
  disabled?: boolean
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  variant?: 'outlined' | 'contained'
  onClick?: () => void
  icon?: 'add' | 'edit' | 'delete' | 'download' | 'upload' | 'print' | 'search'
}

export default function Badge({
  children,
  className = '',
  type = 'button',
  color = 'success',
  disabled = false,
  size = 'sm',
  onClick,
  to,
  variant = 'contained',
  fullWidth = false,
  icon,
}: Props) {
  const classNames = clsx(
    `badge cursor-default badge-${color} badge-${size} badge-${variant}`,
    {
      'badge-disabled cursor-not-allowed': disabled,
      'w-full': fullWidth,
    },
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classNames}>
        {children}
      </Link>
    )
  }

  return (
    <button
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      className={classNames}
      type={type}
    >
      {icon === 'add' && <BsPlus size={25} />}
      {children}
    </button>
  )
}
