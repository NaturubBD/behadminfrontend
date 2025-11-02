import { useModal } from '@ebay/nice-modal-react'
import AnalyticCard from 'components/AnalyticCard'
import Devider from 'components/Devider'
import Button from 'components/form/button'
import TransactionIcon from 'components/icons/TransactionIcon'
import Title from 'components/Title'
import { privateRequest } from 'config/axios.config'
import payToDoctorsModal from 'features/wallet/pay-to-doctors.modal'
import payToEyebuddyModal from 'features/wallet/pay-to-eyebuddy.modal'
import { BsArrowBarUp } from 'react-icons/bs'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { amountFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'

export default function WalletPage() {
  const payToDoctors = useModal(payToDoctorsModal)
  const payToEyebuddy = useModal(payToEyebuddyModal)

  const { data, isLoading: isLoadingStatistics } = useQuery<WalletStatistics, Error>(
    'wallet-statistics',
    async () => {
      try {
        const res = await privateRequest.get('admin/wallet/statistics')
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
  )

  return (
    <div>
      <div className='card'>
        <Title variant='card_title' className='mb-3'>
          Current Balance
        </Title>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <AnalyticCard
            isLoading={isLoadingStatistics}
            title='Hospital'
            value={`${amountFormatter(data?.balance.hospital)} Tk.`}
          >
            <div className='flex justify-end mt-4'>
              <Link
                className='btn btn-primary btn-outlined btn-sm'
                to='/transactions/hospitalAdmin'
              >
                <TransactionIcon /> Transactions History
              </Link>
            </div>
          </AnalyticCard>
          <AnalyticCard
            isLoading={isLoadingStatistics}
            title='Doctors'
            value={`${amountFormatter(data?.balance.doctors)} Tk.`}
          >
            <div className='flex gap-3 justify-end mt-4'>
              <Button size='sm' onClick={() => payToDoctors.show()}>
                <BsArrowBarUp size={18} /> Pay
              </Button>
              <Link className='btn btn-primary btn-outlined btn-sm' to='/transactions/doctor'>
                <TransactionIcon /> Transactions History
              </Link>
            </div>
          </AnalyticCard>
          <AnalyticCard
            isLoading={isLoadingStatistics}
            title='EyeBuddy'
            value={`${amountFormatter(data?.balance.eyeBuddy)} Tk.`}
          >
            <div className='flex gap-3 justify-end mt-4'>
              <Button onClick={() => payToEyebuddy.show()} size='sm'>
                <BsArrowBarUp size={18} /> Pay
              </Button>
              <Link className='btn btn-primary btn-outlined btn-sm' to='/transactions/eyeBuddy'>
                <TransactionIcon /> Transactions History
              </Link>
            </div>
          </AnalyticCard>
        </div>
      </div>
      <Devider />
      <div className='card'>
        <Title variant='card_title' className='mb-3'>
          Total Earnings
        </Title>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <AnalyticCard
            isLoading={isLoadingStatistics}
            title='Hospital'
            value={`${amountFormatter(data?.totalEarning.hospital)} Tk.`}
          />
          <AnalyticCard
            isLoading={isLoadingStatistics}
            title='Doctors'
            value={`${amountFormatter(data?.totalEarning.doctor)} Tk.`}
          />
          <AnalyticCard
            isLoading={isLoadingStatistics}
            title='EyeBuddy'
            value={`${amountFormatter(data?.totalEarning.eyeBuddy)} Tk.`}
          />
        </div>
      </div>
    </div>
  )
}
