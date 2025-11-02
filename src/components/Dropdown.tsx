import clsx from 'clsx'
import { MutableRefObject, PropsWithChildren, useRef, useState } from 'react'
import { MdOutlineMoreVert } from 'react-icons/md'

import useClickOutside from 'utils/useClickOutside'
interface Props {
  className?: string
  selectorClass?: string
  containerClass?: string
  selector?: JSX.Element
  closeOnClick?: boolean
  position?: 'left' | 'right' | 'center'
}

const Dropdown = ({
  children,
  className = '',
  containerClass = '',
  selectorClass = '',
  selector,
  position = 'left',
  closeOnClick = false,
}: PropsWithChildren<Props>) => {
  const [open, setOpen] = useState<boolean>(false)

  const toggle = () => {
    setOpen((prev) => !prev)
  }
  const handleOutsideClose = () => {
    setOpen(false)
  }

  const ref = useRef(null)
  useClickOutside(ref as unknown as MutableRefObject<HTMLDivElement>, handleOutsideClose)

  return (
    <div id='menu' ref={ref} className={clsx('inline-block relative', containerClass)}>
      <button onClick={toggle} className={selectorClass}>
        {selector ?? <MdOutlineMoreVert />}
      </button>
      {open ? (
        <div
          onClick={closeOnClick ? handleOutsideClose : () => console.log()}
          className={clsx(
            'p-2 absolute z-10 opacity-0 transition-all delay-75 bg-slate-50 border border-slate-200 rounded-md shadow-sm',
            {
              'left-0': position === 'left',
              'right-0': position === 'right',
              'left-1/2 -translate-x-1/2': position === 'center',
              'opacity-100': open,
            },
            className,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  )
}

export default Dropdown
