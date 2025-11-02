import clsx from 'clsx'
import { Link } from 'react-router-dom'

type Props = {
  options: Option[]
  selected: string
  selectHandler?: (selected: Option) => void
}

export default function LinkTabs({ options, selected }: Props) {
  return (
    <ul className='flex sm:inline-flex flex-wrap rounded-lg overflow-hidden'>
      {options?.map((option) => (
        <li key={option.label} className='flex-1 sm:flex-auto'>
          <Link
            to={option.value}
            className={clsx(
              'h-11 grid place-items-center px-1 sm:px-5 font-medium text-xs sm:text-sm',
              selected === option.value ? 'bg-primary text-white' : 'bg-[#EFEFEF] text-dark',
            )}
          >
            {option.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
