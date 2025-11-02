import Dropdown from 'components/Dropdown'
import { Loader } from 'components/Loader'
import { AuthContext } from 'context/AuthContext'
import { PropsWithChildren, useContext } from 'react'
import { CiImageOn } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { assetUrl } from 'utils/url'
import Layout from './Layout'

type Props = {
  title: string
}

export default function RequireAdmin({ title, children }: PropsWithChildren<Props>) {
  const { setDrawerShow, user } = useContext(AuthContext)

  if (user?.role === 'customerSupportManager') {
    window.location.replace('/customer-support/request')
    return <Loader className='h-screen' />
  }

  return (
    <Layout>
      <header className='bg-white flex items-center px-5 lg:px-9 py-9'>
        <svg
          className='lg:hidden cursor-pointer mr-3'
          onClick={() => setDrawerShow(true)}
          stroke='currentColor'
          fill='currentColor'
          strokeWidth='0'
          viewBox='0 0 1024 1024'
          height='25'
          width='25'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d='M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z'></path>
        </svg>
        <h2 className='text-xl md:text-2xl font-medium'>{title}</h2>
        <div className='ml-auto flex items-center gap-4'>
          <Dropdown
            selector={
              <div className='flex items-center gap-2'>
                <p className='text-md max-w-[150px] whitespace-nowrap text-ellipsis overflow-hidden font-medium'>
                  {user?.username}
                </p>
                <div className='w-10 h-10 overflow-hidden rounded-full border-2 border-gray-300'>
                  {user?.photo ? (
                    <img
                      src={assetUrl + user?.photo}
                      alt='user'
                      className='h-full w-full object-cover rounded-full'
                    />
                  ) : (
                    <CiImageOn />
                  )}
                </div>
              </div>
            }
            className='w-40 p-0'
            position='right'
          >
            <ul>
              <li className='p-2 hover:bg-slate-100'>
                <Link className='block' to='/profile'>
                  Profile
                </Link>
              </li>
            </ul>
          </Dropdown>
        </div>
      </header>
      <main className='p-4 md:p-6'>{children}</main>
    </Layout>
  )
}
