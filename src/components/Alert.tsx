import clsx from 'clsx'
import React from 'react'
import { BsCheck2Circle } from 'react-icons/bs'
import { RiErrorWarningLine } from 'react-icons/ri'
import { VscError } from 'react-icons/vsc'

type AlertProps = {
  message: string
  type?: 'success' | 'error' | 'warning'
  size?: 'sm' | 'md' | 'lg'
}

const Alert: React.FC<AlertProps> = ({ message, type = 'error', size = 'lg' }) => {
  const baseClasses = 'flex items-center gap-2 rounded text-white'
  const typeClasses = clsx({
    'bg-green-500': type === 'success',
    'bg-red-500': type === 'error',
    'bg-yellow-500': type === 'warning',
    'p-4 font-semibold text-base': size === 'lg',
    'p-3 font-medium text-sm': size === 'md',
    'p-2 font-medium text-xs': size === 'sm',
  })
  const classes = `${baseClasses} ${typeClasses}`

  const iconSize = size === 'lg' ? 30 : size === 'md' ? 25 : 20

  return (
    <div className={classes}>
      {type === 'success' && <BsCheck2Circle size={iconSize} />}
      {type === 'warning' && <RiErrorWarningLine size={iconSize} />}
      {type === 'error' && <VscError size={iconSize} />}
      {message}
    </div>
  )
}

export default Alert
