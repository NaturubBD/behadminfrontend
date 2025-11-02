import React from 'react'

type Props = {
  title: string
  children?: React.ReactNode
}

export default function CardTitle({ title, children }: Props) {
  return (
    <h2 className='flex items-center gap-2 font-normal text-lg text-dark dark:text-slate-300 mb-2'>
      <span className='bg-primary h-2 w-2 rounded-full' />
      {title}
      {children}
    </h2>
  )
}
