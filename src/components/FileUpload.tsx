import clsx from 'clsx'
import { ChangeEventHandler } from 'react'
import { CiEdit } from 'react-icons/ci'
import { IoClose } from 'react-icons/io5'
import { RiImageAddLine } from 'react-icons/ri'

type Props = {
  value: File | null
  defaultValue?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  name: string
  label?: string
  placeholder?: string
  error?: boolean
  helpText?: string
  size?: 'sm' | 'md' | 'lg'
  labelClassName?: string
}

export default function FileUpload({
  value,
  defaultValue,
  error,
  helpText,
  label,
  size = 'lg',
  labelClassName,
  ...rest
}: Props) {
  return (
    <div className='relative'>
      {label && (
        <label className='flex items-center gap-2 text-sm font-medium text-slate-500 mb-2'>
          {label}
        </label>
      )}
      {value && (
        <div
          onClick={() => {
            rest.onChange({ target: { name: rest.name, value: null } } as any)
          }}
          className='absolute z-10 right-2 top-9 cursor-pointer h-8 w-8 rounded-full grid place-items-center bg-primary/70 hover:bg-primary text-white'
        >
          <IoClose size={22} />
        </div>
      )}
      <label
        className={clsx(
          'relative cursor-pointer bg-primary-shade flex items-center border border-transparent placeholder-slate-400  disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-sky-500 w-full rounded-md overflow-hidden sm:text-sm focus:ring-1 invalid:text-pink-600 focus:invalid:ring-pink-500 disabled:shadow-none',
          {
            '!border-red-400': error,
            'h-[45px]': size === 'sm',
            'h-[55px]': size === 'md',
            'h-[100px]': size === 'lg',
          },
          labelClassName,
        )}
      >
        {value ? (
          <img className='h-full w-full object-contain' src={URL.createObjectURL(value)} alt='' />
        ) : (
          <span className='absolute inset-0 flex items-center justify-center'>
            {defaultValue ? (
              <>
                <img className='h-full w-full object-contain' src={defaultValue} alt='' />
                <div className='absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full grid place-items-center bg-dark/50 text-white'>
                  <CiEdit size={22} />
                </div>
              </>
            ) : (
              <RiImageAddLine size={35} />
            )}
          </span>
        )}
        <input hidden {...rest} type='file' />
      </label>
      <p className='text-red-500 text-sm font-semibold my-1'>{helpText}</p>
    </div>
  )
}
