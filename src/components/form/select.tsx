import clsx from 'clsx'
import { useRef, useState } from 'react'
import { LoaderIcon } from 'react-hot-toast'

import { BsChevronDown } from 'react-icons/bs'
import useClickOutside from 'utils/useClickOutside'
// import useClickOutside from "utils/useClickOutside";

type Props = {
  value?: Option
  placeholder?: string
  options: Option[]
  name?: string
  className?: string
  containerClass?: string
  align?: 'left' | 'right'
  error?: boolean
  helpText?: string
  label?: string
  isEmpty?: boolean
  isLoading?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'contained'
  onChange: (target: { target: { value: Option; name: string } }) => void
}

const Select = ({
  value,
  placeholder,
  options,
  onChange,
  name = '',
  className = '',
  containerClass = '',
  align = 'left',
  error,
  helpText,
  isEmpty = false,
  isLoading = false,
  label,
  size = 'lg',
  variant = 'contained',
}: Props) => {
  const [open, setOpen] = useState<boolean>(false)

  const toggle = () => {
    setOpen((prev) => !prev)
  }
  const closeHandler = () => {
    setOpen(false)
  }

  const ref = useRef(null)
  useClickOutside(ref, closeHandler)

  const selectHandler = (value: Option) => {
    onChange({ target: { value, name } })
    closeHandler()
  }

  return (
    <div ref={ref} className={clsx('relative inline-block', containerClass)}>
      {label && (
        <label htmlFor={name} className='block text-sm font-medium text-slate-500 mb-2'>
          {label}
        </label>
      )}
      <div
        onClick={toggle}
        className={clsx(
          'w-full cursor-pointer border border-transparent select-none flex items-center rounded-md px-3',
          {
            'h-[35px]': size === 'sm',
            'h-[45px]': size === 'md',
            'h-[55px]': size === 'lg',
            'bg-primary-shade': variant === 'contained',
            'bg-inherit border-[1.5px] !border-[#efefef]': variant === 'outlined',
            '!border-red-400 !focus:border-red-500 !focus:ring-red-500': error,
          },
          className,
        )}
      >
        <span className={clsx('whitespace-nowrap mr-auto', { 'text-gray': !value })}>
          {value?.label ?? placeholder}
        </span>{' '}
        {isLoading && <LoaderIcon className='mr-3' />}
        <BsChevronDown size={15} className='ml-1' />
      </div>
      <ul
        className={clsx(
          'absolute top-full z-20 min-w-full w-max border border-slate-200 border-solid shadow-sm rounded-md bg-white transition-all',
          {
            'visible opacity-100': open,
            'invisible opacity-0': !open,
          },
          align === 'left' ? 'left-0' : 'right-0',
        )}
      >
        {isEmpty && (
          <li
            role='button'
            className='px-3 py-1 hover:bg-slate-50 cursor-pointer'
            onClick={() => selectHandler({ label: 'Select', value: '' })}
          >
            Select
          </li>
        )}
        {options.map((option, i) => (
          <li
            role='button'
            key={i}
            className='px-3 py-1 hover:bg-slate-50 cursor-pointer'
            onClick={() => selectHandler(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
      <p className='text-red-500 text-sm font-semibold my-1'>{helpText}</p>
    </div>
  )
}

export default Select
