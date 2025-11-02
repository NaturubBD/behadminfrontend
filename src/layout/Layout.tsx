import Drawer from 'constants/Drawer'
import { PropsWithChildren } from 'react'

export default function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className='flex flex-nowrap'>
      <Drawer />
      <div className='flex-1 w-full lg:pl-72'>{children}</div>
    </div>
  )
}
