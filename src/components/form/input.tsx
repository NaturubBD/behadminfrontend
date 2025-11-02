import clsx from 'clsx'
import Tooltip from 'components/Tooltip'
import { ChangeEventHandler } from 'react'
import { BsInfoCircleFill } from 'react-icons/bs'

type Props = {
  label?: string | JSX.Element
  info?: string
  type?: React.HTMLInputTypeAttribute | 'toggle'
  name?: string
  disabled?: boolean
  className?: string
  inputClassName?: string
  error?: boolean
  helpText?: string
  value?: string | number | readonly string[] | undefined
  checked?: boolean
  placeholder?: string
  min?: number
  max?: number
  prefix?: string | JSX.Element
  afterFix?: JSX.Element
  readOnly?: boolean
  multiline?: boolean
  rows?: number
  onChange?: ChangeEventHandler<HTMLInputElement>
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'contained'
}

export default function Input({
  label,
  info,
  type = 'text',
  name,
  disabled = false,
  className = '',
  inputClassName = '',
  value = '',
  checked,
  placeholder,
  error,
  helpText,
  max,
  min,
  prefix = '',
  afterFix,
  readOnly = false,
  multiline = false,
  rows = 5,
  size = 'lg',
  variant = 'contained',
  onChange,
  onKeyPress,
}: Props) {
  if (type === 'radio') {
    return (
      <div className={clsx('w-full', className)}>
        <label className='inline-flex gap-3 items-center cursor-pointer'>
          <div className='relative'>
            <input
              id={value.toString()}
              name={name}
              type='radio'
              value={value}
              checked={checked}
              onChange={onChange}
              className={clsx('sr-only peer bg-inherit', inputClassName)}
            />
            <div className='cursor-pointer h-7 w-7 rounded-full border-2 border-primary peer-checked:bg-primary peer-checked:border-white peer-checked:outline outline-primary transition-all' />
          </div>
          <span className='text-base font-medium text-dark'>{label}</span>
        </label>
        <p className='text-red-500 text-sm font-semibold my-1'>{helpText}</p>
      </div>
    )
  }

  if (type === 'toggle') {
    return (
      <div className={clsx('w-full', className)}>
        <label htmlFor={name} className='inline-flex gap-3 items-center cursor-pointer'>
          <div className='relative'>
            <input
              id={name}
              type='checkbox'
              checked={checked}
              onChange={onChange}
              className={clsx('sr-only peer bg-inherit', inputClassName)}
            />
            <div className="w-11 h-6 peer-focus:outline-none rounded-full peer  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary bg-slate-100"></div>
          </div>
          <span className='text-sm select-none font-semibold text-slate-900'>{label}</span>
        </label>
        <p className='text-red-500 text-sm font-semibold my-1'>{helpText}</p>
      </div>
    )
  }

  if (type === 'checkbox') {
    return (
      <div className={clsx('w-full', className)}>
        <div className='flex items-center'>
          <input
            checked={checked}
            onChange={onChange}
            id={name}
            type='checkbox'
            value=''
            className='w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-0'
          />
          {label && (
            <label
              htmlFor={name}
              className='select-none cursor-pointer ml-2 text-sm font-medium text-gray-900 dark:text-gray-300'
            >
              {label}
            </label>
          )}
        </div>
        <p className='text-red-500 text-sm font-semibold my-1'>{helpText}</p>
      </div>
    )
  }

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={name}
          className='flex items-center gap-2 text-sm font-medium text-slate-500 mb-2'
        >
          {label}
          {info && (
            <Tooltip message={info}>
              <BsInfoCircleFill color='#666' size={20} className='inline' />
            </Tooltip>
          )}
        </label>
      )}
      <div
        className={clsx(
          'relative flex items-center border border-transparent placeholder-slate-400  disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-sky-500 w-full rounded-md overflow-hidden sm:text-sm focus:ring-1 invalid:text-pink-600  focus:invalid:ring-pink-500 disabled:shadow-none',
          {
            '!border-red-400': error,
            'h-[55px]': !multiline && size === 'lg',
            'h-[45px]': !multiline && size === 'md',
            'h-[35px]': !multiline && size === 'sm',
            'bg-primary-shade': variant === 'contained',
            'bg-inherit border-[1.5px] !border-[#efefef]': variant === 'outlined',
          },
          inputClassName,
        )}
      >
        {prefix && <span className='pl-1'>{prefix}</span>}
        {multiline ? (
          <textarea
            readOnly={readOnly}
            rows={rows}
            placeholder={placeholder}
            value={value}
            name={name}
            id={name}
            disabled={disabled}
            className={clsx('px-3 pt-4 h-full w-full outline-none bg-inherit', {
              '!pl-[1px]': prefix,
            })}
            onChange={onChange as any}
          ></textarea>
        ) : (
          <input
            readOnly={readOnly}
            min={min}
            max={max}
            placeholder={placeholder}
            value={value}
            type={type}
            name={name}
            id={name}
            disabled={disabled}
            className={clsx('px-3 h-full w-full outline-none bg-inherit', {
              '!pl-[1px]': prefix,
            })}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
        )}
        {afterFix && afterFix}
      </div>
      <p className='text-red-500 text-sm font-semibold my-1'>{helpText}</p>
    </div>
  )
}
