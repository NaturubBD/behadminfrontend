import BookingsIcon from 'components/icons/BookingsIcon'
import DoctorsIcon from 'components/icons/DoctorsIcon'
import PatientsIcon from 'components/icons/PatientsIcon'
import PaymentHubIcon from 'components/icons/PaymentHubIcon'
import ProfitLossIcon from 'components/icons/ProfitLossIcon'
import PromotionIcon from 'components/icons/PromotionIcon'
import PushNotificationIcon from 'components/icons/PushNotificationIcon'
import ResolutionCenterIcon from 'components/icons/ResolutionCenterIcon'
import SubAdminIcon from 'components/icons/SubAdminIcon'
import { IoWalletOutline } from 'react-icons/io5'

export const drawerLinks: DrawerLink[] = [
  // {
  //   label: 'Dashboard',
  //   link: '/dashboard',
  //   icon: RxDashboard,
  // },
  {
    label: 'Wallet',
    link: '/wallet',
    icon: IoWalletOutline,
  },
  {
    label: 'All Patients',
    link: '/all-patients',
    icon: PatientsIcon,
    child: [
      {
        label: 'Pending Patients',
        link: '/all-patients/pending',
      },
      {
        label: 'Active Patients',
        link: '/all-patients/active',
      },
      {
        label: 'Inactive Patients',
        link: '/all-patients/inactive',
      },
    ],
  },
  {
    label: 'All Doctors',
    link: '/all-doctors',
    icon: DoctorsIcon,
    child: [
      {
        label: 'Pending Doctors',
        link: '/all-doctors/pending',
      },
      {
        label: 'Active Doctors',
        link: '/all-doctors/active',
      },
      {
        label: 'Inactive Doctors',
        link: '/all-doctors/inactive',
      },
    ],
  },
  {
    label: 'All Bookings',
    link: '/all-bookings',
    icon: BookingsIcon,
    child: [
      {
        label: 'Current Bookings',
        link: '/all-bookings/current',
      },
      {
        label: 'Completed Bookings',
        link: '/all-bookings/completed',
      },
      {
        label: 'Cancelled Bookings',
        link: '/all-bookings/cancelled',
      },
    ],
  },
  {
    label: 'Resolution Center',
    link: '/resolution-center',
    icon: ResolutionCenterIcon,
    child: [
      {
        label: 'Late calls',
        link: '/resolution-center/late-calls',
      },
      {
        label: 'Dropped Calls',
        link: '/resolution-center/dropped-calls',
      },
    ],
  },
  {
    label: 'Dr’s Payment Hub',
    link: '/dr-payment-hub',
    icon: PaymentHubIcon,
    child: [
      {
        label: 'Pending Withdrawals',
        link: '/dr-payment-hub/pending-withdrawals',
      },
      {
        label: 'Withdrawals History',
        link: '/dr-payment-hub/withdrawals-history',
      },
    ],
  },
  {
    label: 'Promotion',
    link: '/promotion',
    icon: PromotionIcon,
    child: [
      {
        label: 'Promo Code',
        link: '/promotion/promo-code',
      },
      {
        label: 'Promotional Banners',
        link: '/promotion/promotional-banners',
      },
    ],
  },
  {
    label: 'Push Notification',
    link: '/push-notification',
    icon: PushNotificationIcon,
  },
  {
    label: 'Profit',
    link: '/profit',
    icon: ProfitLossIcon,
  },
  {
    label: 'Sub Admins',
    link: '/sub-admins',
    icon: SubAdminIcon,
  },
]
