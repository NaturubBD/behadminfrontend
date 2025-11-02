import clsx from 'clsx'
import Collapse from 'components/Collapse'
import { AuthContext } from 'context/AuthContext'
import logo from 'images/logo.svg'
import { useContext, useEffect, useState } from 'react'
import { HiOutlineChevronDown } from 'react-icons/hi2'
import { IoIosLogOut } from 'react-icons/io'
import { NavLink, useLocation } from 'react-router-dom'
import { drawerLinks } from './drawerLinks'

const Drawer = () => {
  const [selectedId, setSelectedId] = useState<number>(0)
  const location = useLocation()
  const { isDrawerShow, setDrawerShow } = useContext(AuthContext)

  useEffect(() => {
    setSelectedId(0)
    setDrawerShow(false)
  }, [location.pathname])

  useEffect(() => {
    if (isDrawerShow) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isDrawerShow])

  const { logOut } = useContext(AuthContext)

  return (
    <>
      <div
        className={clsx(
          'bg-white transition-all overflow-y-auto fixed lg:left-0 top-0 p-4 pr-0 h-screen w-72 z-50',
          {
            '-left-full': !isDrawerShow,
            'left-0': isDrawerShow,
          },
        )}
      >
        <img src={logo} className='w-40' alt='Visasis' />
        <ul className='mt-6'>
          {drawerLinks.map((menu, i) => {
            if (menu.child) {
              return (
                <li
                  key={i}
                  onClick={() => setSelectedId((prev) => (prev === i + 1 ? 0 : i + 1))}
                  className='select-none text-base font-normal cursor-pointer'
                >
                  <p
                    className={clsx(
                      'text-dark text-base font-medium hover:bg-slate-100 rounded-l-lg flex items-center gap-3 p-4',
                      location.pathname.includes(menu.link) && 'active_menu',
                    )}
                  >
                    <menu.icon className='h-6 w-6 text-inherit shadow-light rounded-md' />
                    {menu.label}
                    <HiOutlineChevronDown
                      size={22}
                      className={clsx('ml-auto transition-all', {
                        'rotate-180':
                          location.pathname.includes(menu.link) ||
                          selectedId === i + 1 ||
                          location.pathname.includes(menu.link),
                      })}
                    />
                  </p>

                  <ChildMenu
                    data={menu.child}
                    isOpen={location.pathname.includes(menu.link) || selectedId === i + 1}
                  />
                </li>
              )
            } else {
              return (
                <li className='text-base font-normal' key={i}>
                  <NavLink
                    className={({ isActive }) =>
                      clsx(
                        'text-dark text-base font-medium hover:bg-slate-100 rounded-l-lg p-4 flex items-center gap-3',
                        isActive && 'active_menu',
                      )
                    }
                    to={menu.link}
                  >
                    <menu.icon className='h-6 w-6 text-inherit shadow-light rounded-md' />{' '}
                    {menu.label}
                  </NavLink>
                </li>
              )
            }
          })}
          <li>
            <div
              onClick={logOut}
              className='cursor-pointer text-base font-medium inline-flex items-center gap-3 p-4'
            >
              <IoIosLogOut className='h-6 w-6 text-inherit shadow-light rounded-md' /> Logout
            </div>
          </li>
        </ul>
      </div>
      <div
        onClick={() => setDrawerShow(false)}
        className={clsx(
          'lg:hidden transition-all fixed left-0 top-0 h-screen w-full z-40 bg-primary bg-opacity-40 cursor-pointer',
          {
            'invisible opacity-0': !isDrawerShow,
          },
        )}
      />
    </>
  )
}

export default Drawer

interface ChildMenuProps {
  data: DrawerChild
  isOpen: boolean
}

const ChildMenu = ({ data, isOpen }: ChildMenuProps) => {
  return (
    <ul
      className={clsx(
        'cursor-default transition-all pl-9 duration-300 ml-4 overflow-hidden',
        isOpen ? 'max-h-full' : 'max-h-0 !border-transparent',
      )}
    >
      <Collapse isActive={isOpen}>
        {data.map((child, i) => (
          <li className='my-3 text-base' key={i}>
            <NavLink
              className={({ isActive }) =>
                clsx(
                  'hover:text-primary text-base block font-medium text-[#BBBBBB]',
                  isActive && '!text-primary',
                )
              }
              to={child.link}
            >
              {child.label}
            </NavLink>
          </li>
        ))}
      </Collapse>
    </ul>
  )
}
