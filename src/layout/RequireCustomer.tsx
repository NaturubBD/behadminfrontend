import Dropdown from 'components/Dropdown'
import LinkTabs from 'components/LinkTabs'
import { Loader } from 'components/Loader'
import { AuthContext } from 'context/AuthContext'
import SupportContextProvider from 'context/supportContext'
import { PropsWithChildren, useContext } from 'react'
import { CiImageOn } from 'react-icons/ci'
import { Link } from 'react-router-dom'
import { assetUrl } from 'utils/url'

type Props = {
  title: string
}

const links = [
  { label: 'Requested', value: '/customer-support/request' },
  { label: 'Ongoing', value: '/customer-support/ongoing' },
  { label: 'Resolved', value: '/customer-support/resolved' },
]

export default function RequireCustomer({ title, children }: PropsWithChildren<Props>) {
  const { user, logOut } = useContext(AuthContext)
  const { pathname } = window.location

  if (user?.role !== 'customerSupportManager') {
    window.location.replace('/')
    return <Loader className='h-screen' />
  }

  return (
    <>
      <header className='bg-white flex items-center px-5 py-2'>
        <h2 className='text-base font-medium'>{title}</h2>
        <div className='ml-auto flex items-center gap-4'>
          <Dropdown
            selector={
              <div className='flex items-center gap-2'>
                <p className='capitalize text-md max-w-[150px] whitespace-nowrap text-ellipsis overflow-hidden font-medium'>
                  {user?.name}
                </p>
                <div className='h-10 w-10 text-dark border-2 border-primary/60 rounded-full grid place-items-center'>
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
              <li className='p-2 cursor-pointer hover:bg-slate-100'>
                <Link to='/customer-support/profile'>Profile</Link>
              </li>
              <li onClick={logOut} className='p-2 cursor-pointer hover:bg-slate-100'>
                Logout
              </li>
            </ul>
          </Dropdown>
        </div>
      </header>
      <main className='p-4'>
        <div className='card !p-3'>
          <SupportContextProvider>
            <LinkTabs options={links} selected={pathname} />
            <div className='h-3'></div>
            {children}
          </SupportContextProvider>
        </div>
      </main>
    </>
  )
}
