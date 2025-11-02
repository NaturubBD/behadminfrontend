import React from 'react'

type Props = {
  title: string
  children?: React.ReactNode
}

export default function PageTitle({ title, children }: Props) {
  return (
    <h2 className='flex items-center gap-2 py-4 font-medium text-xl text-dark dark:text-slate-300 border-b border-solid border-slate-300 mb-6'>
      <span className='bg-primary h-7 w-1.5 rounded-md' />
      {title}
      {children}
    </h2>
  )
}
