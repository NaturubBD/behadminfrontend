import clsx from 'clsx'
import Skeleton from 'components/Skeleton'
import moment from 'moment'
import { assetUrl } from 'utils/url'

type Props = {
  data: SupportRequest
  isActive?: boolean
  onActive?: (customer: SupportRequest) => void
}

export default function CustomerListItemCard({ data, onActive, isActive }: Props) {
  return (
    <div
      onClick={() => onActive?.(data)}
      className={clsx(
        'flex items-center justify-between gap-3 p-3 first-of-type:border-none border-t-[0.5px] border-[#CECECE] hover:bg-[#F9F9F9] cursor-pointer transition-all',
        {
          '!bg-[#F9F9F9]': isActive,
        },
      )}
    >
      {data?.user?.photo && (
        <img
          src={assetUrl + data?.user?.photo}
          className='h-11 w-11 rounded-full overflow-hidden object-cover'
          alt=''
        />
      )}
      <div className='flex-1'>
        <h2 className='text-base font-medium mb-1'>{data.user.name}</h2>
        <p className='text-xs text-[#777]'>Me: need api for this message</p>
      </div>
      {data?.createdAt && (
        <p className='font-medium text-xs text-[#777]'>{moment(data.createdAt).fromNow()}</p>
      )}
    </div>
  )
}

CustomerListItemCard.Skeleton = () => {
  return (
    <div className='flex items-center justify-between gap-4 py-6 px-9 first-of-type:border-none border-t-[0.5px] border-[#CECECE] hover:bg-[#F9F9F9] cursor-pointer transition-all'>
      <Skeleton className='h-16 w-16 !rounded-full' />
      <div className='flex-1'>
        <Skeleton className='h-3 w-20 mb-2' />
        <Skeleton className='h-2 w-40' />
      </div>
      <Skeleton className='h-3 w-5' />
    </div>
  )
}
