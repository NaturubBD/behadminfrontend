import clsx from 'clsx'

type Props = {
  options: TabOption[]
  selected: TabOption
  selectHandler: (selected: TabOption) => void
}

export default function Tabs({ options, selected, selectHandler }: Props) {
  return (
    <ul className='inline-flex flex-wrap rounded-lg overflow-hidden bg-[#EFEFEF]'>
      {options?.map((option) => (
        <li
          onClick={() => selectHandler(option)}
          className={clsx(
            'h-12 rounded-lg overflow-hidden grid place-items-center px-8 font-semibold text-sm cursor-pointer',
            selected.value === option.value ? 'bg-primary text-white' : 'text-dark',
          )}
          key={option.value}
        >
          {option.label}
        </li>
      ))}
    </ul>
  )
}
