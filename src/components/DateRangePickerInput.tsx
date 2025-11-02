import clsx from 'clsx'
import DatePicker from 'react-date-picker'
import { BsInfoCircleFill } from 'react-icons/bs'
import Tooltip from './Tooltip'
import ClenderIcon from './icons/clenderIcon'

type Props = {
  label?: string | JSX.Element
  name?: string
  disabled?: boolean
  info?: string
  className?: string
  error?: boolean
  helpText?: string
  value: [Date, Date]
  placeholder?: string
  prefix?: string
  afterFix?: JSX.Element
  onChange: (e: [Date, Date], name: string) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'contained'
}

export default function DateRangePickerInput({
  label,
  name = '',
  className = '',
  onChange,
  error,
  helpText,
  afterFix,
  size = 'lg',
  variant = 'contained',
  value,
  info,
}: Props) {
  return (
    <div>
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
          'relative flex items-center border  placeholder-slate-400  disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:ring-sky-500 w-full rounded-md sm:text-sm focus:ring-1 invalid:text-pink-600  focus:invalid:ring-pink-500 disabled:shadow-none',
          {
            '!border-red-400': error,
            'h-[55px]': size === 'lg',
            'h-[45px]': size === 'md',
            'h-[35px]': size === 'sm',
            'bg-primary-shade border-transparent': variant === 'contained',
            'bg-inherit border-[1.5px] !border-[#efefef]': variant === 'outlined',
          },
          className,
        )}
      >
        <DatePicker
          calendarIcon={<ClenderIcon className='cursor-pointer' />}
          className='w-full px-2'
          onChange={(e) => onChange([e as Date, value[1]], name)}
          value={value?.[0]}
          format='dd MMMM yyyyy'
          maxDate={value?.[1]}
        />
        <DatePicker
          calendarIcon={<ClenderIcon className='cursor-pointer' />}
          className='w-full px-2'
          onChange={(e) => onChange([value[0], e as Date], name)}
          value={value?.[1]}
          format='dd MMMM yyyyy'
          activeStartDate={value?.[0]}
        />

        {afterFix && afterFix}
      </div>

      <p className='text-red-500 text-sm font-semibold my-1'>{helpText}</p>
    </div>
  )
}
