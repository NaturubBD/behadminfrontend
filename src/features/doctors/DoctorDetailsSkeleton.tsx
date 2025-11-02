import Skeleton from 'components/Skeleton'

export default function DoctorDetailsSkeleton() {
  return (
    <div className='card'>
      <div className='flex mb-8 gap-8 items-center'>
        <div className='h-28 w-28 rounded-full bg-slate-200'></div>
        <div className='border-b border-[#BBBBBB] flex-1 pb-5'>
          <Skeleton className='w-40 h-5' />
          <Skeleton className='w-40 h-5 my-5' />
          <Skeleton className='w-1/4 h-5' />
        </div>
      </div>

      <div className='flex flex-wrap gap-14'>
        <div>
          <Skeleton className='w-40 h-5 mb-4' />
          <Skeleton className='w-40 h-3' />
        </div>
        <div>
          <Skeleton className='w-40 h-5 mb-4' />
          <Skeleton className='w-40 h-3' />
        </div>
        <div>
          <Skeleton className='w-40 h-5 mb-4' />
          <Skeleton className='w-40 h-3' />
        </div>
        <div>
          <Skeleton className='w-40 h-5 mb-4' />
          <Skeleton className='w-40 h-3' />
        </div>
      </div>
      <Skeleton className='w-28 h-4 mt-20' />
      <Skeleton className='w-40 h-2 mt-8 mb-3' />
      <Skeleton className='w-1/3 h-2 mb-4' />
      <Skeleton className='w-1/3 h-2 mb-4' />
      <Skeleton className='w-1/3 h-2 mb-4' />
      <Skeleton className='w-1/3 h-2 mb-4' />
      <Skeleton className='w-1/3 h-2 mb-4' />
      <Skeleton className='w-20 h-3 mt-4 mb-10' />
      <div className='grid grid-cols-3 gap-4 mt-6'>
        <div className='card p-7 border border-gray-4'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-3 w-20 mt-9 mb-3' />
          <Skeleton className='h-3 w-16' />
        </div>
      </div>
      <div className='flex justify-end mt-20'>
        <Skeleton className='w-52 h-14' />
      </div>
    </div>
  )
}
