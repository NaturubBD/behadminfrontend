import ActiveCustomer from 'features/support/ActiveCustomer'
import OngoingMessages from 'features/support/OngoingMessages'
import OngoingSupportList from 'features/support/OngoingSupportList'

export default function OngoingPage() {
  return (
    <div className='grid lg:grid-cols-12 gap-5'>
      <div className='lg:col-span-4'>
        <OngoingSupportList />
      </div>
      <div className='lg:col-span-8'>
        <ActiveCustomer />
        <OngoingMessages />
      </div>
    </div>
  )
}
