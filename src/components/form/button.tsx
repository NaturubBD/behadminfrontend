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

export default function Button({
  children,
  className = '',
  type = 'submit',
  color = 'primary',
  disabled = false,
  size = 'lg',
  onClick,
  to,
  variant = 'contained',
  fullWidth = false,
  icon,
}: Props) {
  const classNames = clsx(
    `btn btn-${color} btn-${size} btn-${variant}`,
    {
      'btn-disabled cursor-not-allowed': disabled,
      'w-full': fullWidth,
    },
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classNames}>
        {icon === 'add' && <BsPlus size={25} />}
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
