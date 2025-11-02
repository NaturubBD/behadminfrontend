import RequireAuth from 'components/auth/RequireAuth'
import { AuthContext } from 'context/AuthContext'
import RequireAdmin from 'layout/RequireAdmin'
import RequireCustomer from 'layout/RequireCustomer'
import { useContext, useEffect, useState } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import PageNotFound from './404'
import AddUpdateDoctorPage from './add-update-doctor'
import BookingsPage from './bookings'
import OngoingPage from './customer-support/ongoing'
import RequestPage from './customer-support/request'
import ResolvedPage from './customer-support/resolved'
import DoctorsPage from './doctors'
import WithdrawalsHistoryPage from './dr-payment-hub/withdrawals-history'
import DroppedCallsPage from './dropped-calls'
import LateCallsPage from './late-calls'
import LoginPage from './login'
import PatientsPage from './patients'
import ProfilePage from './profile'
import ProfitPage from './profit-loss'
import PromoCodePage from './promo-code'
import PromotionalBannersPage from './promotional-banners'
import PushNotificationsPage from './push-notifications'
import SingleDoctor from './single-doctor'
import SubAdminsPage from './sub-admin'
import VerifyPage from './verify'
import WalletPage from './wallet'
import WalletTransactionsPage from './wallet-transactions'

const privateRoute: RouteObject[] = [
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      { index: true, element: <Navigate to='wallet' /> },
      // {
      //   path: 'dashboard',
      //   element: (
      //     <RequireAdmin title='Dashboard'>
      //       <Dashboard />
      //     </RequireAdmin>
      //   ),
      // },
      {
        path: 'profile',
        element: (
          <RequireAdmin title='Profile'>
            <ProfilePage />
          </RequireAdmin>
        ),
      },
      {
        path: 'wallet',
        element: (
          <RequireAdmin title='Wallet'>
            <WalletPage />
          </RequireAdmin>
        ),
      },

      {
        path: 'transactions/doctor',
        element: (
          <RequireAdmin title='Doctor Wallet History'>
            <WalletTransactionsPage type='doctor' />
          </RequireAdmin>
        ),
      },
      {
        path: 'transactions/eyeBuddy',
        element: (
          <RequireAdmin title='EyeBuddy Wallet History'>
            <WalletTransactionsPage type='eyeBuddy' />
          </RequireAdmin>
        ),
      },
      {
        path: 'transactions/hospitalAdmin',
        element: (
          <RequireAdmin title='Hospital Wallet History'>
            <WalletTransactionsPage type='hospitalAdmin' />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-patients/active',
        element: (
          <RequireAdmin title='Active Patients'>
            <PatientsPage patient_type='activated' />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-patients/pending',
        element: (
          <RequireAdmin title='Pending Patients'>
            <PatientsPage patient_type='waitingForApproval' />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-patients/inactive',
        element: (
          <RequireAdmin title='Inactive Patients'>
            <PatientsPage patient_type='disabled' />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-doctors/active',
        element: (
          <RequireAdmin title='Active Doctors'>
            <DoctorsPage doctor_type='activated' />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-doctors/inactive',
        element: (
          <RequireAdmin title='Inactive Doctors'>
            <DoctorsPage doctor_type='disabled' />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-doctors/pending',
        element: (
          <RequireAdmin title='Pending Doctors'>
            <DoctorsPage doctor_type='waitingForApproval' />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-doctors/add',
        element: (
          <RequireAdmin title='Add Doctors'>
            <AddUpdateDoctorPage />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-doctors/edit/:id',
        element: (
          <RequireAdmin title='Edit Doctor'>
            <AddUpdateDoctorPage />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-doctors/:id',
        element: (
          <RequireAdmin title='Doctor Details'>
            <SingleDoctor />
          </RequireAdmin>
        ),
      },
      {
        path: 'all-bookings',
        children: [
          { index: true, element: <Navigate to='current' /> },
          {
            path: 'current',
            element: (
              <RequireAdmin title='Current Bookings'>
                <BookingsPage booking_type='queued' />
              </RequireAdmin>
            ),
          },
          {
            path: 'completed',
            element: (
              <RequireAdmin title='Completed Bookings'>
                <BookingsPage booking_type='completed' />
              </RequireAdmin>
            ),
          },
          {
            path: 'cancelled',
            element: (
              <RequireAdmin title='Cancelled Bookings'>
                <BookingsPage booking_type='refunded' />
              </RequireAdmin>
            ),
          },
        ],
      },
      {
        path: 'resolution-center',
        children: [
          { index: true, element: <Navigate to='late-calls' /> },
          {
            path: 'late-calls',
            element: (
              <RequireAdmin title='Late Calls'>
                <LateCallsPage />
              </RequireAdmin>
            ),
          },
          {
            path: 'dropped-calls',
            element: (
              <RequireAdmin title='Dropped Calls'>
                <DroppedCallsPage />
              </RequireAdmin>
            ),
          },
        ],
      },
      {
        path: 'dr-payment-hub',
        children: [
          { index: true, element: <Navigate to='pending-withdrawals' /> },
          {
            path: 'pending-withdrawals',
            element: (
              <RequireAdmin title='Pending Withdrawals'>
                <WithdrawalsHistoryPage type='pending' />
              </RequireAdmin>
            ),
          },
          {
            path: 'withdrawals-history',
            element: (
              <RequireAdmin title='Withdrawals History'>
                <WithdrawalsHistoryPage type='confirmed' />
              </RequireAdmin>
            ),
          },
        ],
      },
      {
        path: 'promotion',
        children: [
          { index: true, element: <Navigate to='promo-code' /> },
          {
            path: 'promo-code',
            element: (
              <RequireAdmin title='Promo Code'>
                <PromoCodePage />
              </RequireAdmin>
            ),
          },
          {
            path: 'promotional-banners',
            element: (
              <RequireAdmin title='Promotional banners'>
                <PromotionalBannersPage />
              </RequireAdmin>
            ),
          },
        ],
      },
      {
        path: 'push-notification',
        element: (
          <RequireAdmin title='Push Notification'>
            <PushNotificationsPage />
          </RequireAdmin>
        ),
      },
      {
        path: 'sub-admins',
        element: (
          <RequireAdmin title='Sub Admins'>
            <SubAdminsPage />
          </RequireAdmin>
        ),
      },
      {
        path: 'profit',
        element: (
          <RequireAdmin title='Profit'>
            <ProfitPage />
          </RequireAdmin>
        ),
      },
      {
        path: 'customer-support',
        element: <RequireAuth />,
        children: [
          { index: true, element: <Navigate to='/request' /> },
          {
            path: 'request',
            element: (
              <RequireCustomer title='BEH Customer Support'>
                <RequestPage />
              </RequireCustomer>
            ),
          },
          {
            path: 'ongoing',
            element: (
              <RequireCustomer title='BEH Customer Support'>
                <OngoingPage />
              </RequireCustomer>
            ),
          },
          {
            path: 'resolved',
            element: (
              <RequireCustomer title='BEH Customer Support'>
                <ResolvedPage />
              </RequireCustomer>
            ),
          },
          {
            path: 'profile',
            element: (
              <RequireCustomer title='Profile'>
                <ProfilePage />
              </RequireCustomer>
            ),
          },
        ],
      },
      { path: 'login', element: <Navigate to='/' /> },
      { path: 'signup', element: <Navigate to='/' /> },
      { path: 'verify', element: <Navigate to='/' /> },
      { path: '*', element: <PageNotFound /> },
    ],
  },
]

const publicRoute: RouteObject[] = [
  { path: 'login', element: <LoginPage /> },
  { path: 'verify', element: <VerifyPage /> },
  { path: '*', element: <Navigate to='/login' /> },
]

const Routes = () => {
  const { token } = useContext(AuthContext)

  const [routes, setRoutes] = useState<RouteObject[]>(token ? privateRoute : publicRoute)

  // change routes on token state
  useEffect(() => {
    setRoutes(token ? privateRoute : publicRoute)
  }, [token])

  const appRoutes = useRoutes(routes)

  if (token) {
    return <div>{appRoutes}</div>
  }

  return <div>{appRoutes}</div>
}

export default Routes
