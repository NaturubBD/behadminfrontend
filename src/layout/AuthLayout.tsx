import Logo from 'components/Logo'
import { PropsWithChildren } from 'react'

type Props = {
  title?: string
  description?: string
}

export default function AuthLayout({ title, description, children }: PropsWithChildren<Props>) {
  return (
    <div className='min-h-screen flex p-4'>
      <div className='m-auto border bg-white rounded-md border-secondary/50 p-5 lg:p-12 w-full max-w-2xl'>
        <div className='text-center mb-12'>
          <Logo className='mx-auto mb-4' />
          <h2 className='text-2xl font-semibold mb-3'>{title}</h2>
          <p className='text-gray text-lg'>{description}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
