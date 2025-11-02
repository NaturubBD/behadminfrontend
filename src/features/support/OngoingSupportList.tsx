import clsx from 'clsx'
import { privateRequest } from 'config/axios.config'
import { SupportContext } from 'context/supportContext'
import CustomerListItemCard from 'features/support/CustomerListItemCard'
import { useContext, useEffect, useState } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { BsSearch } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

export default function OngoingSupportList() {
  const { setCustomer, customer } = useContext(SupportContext)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading, isRefetching } = useInfiniteQuery<
    SupportRequestResponse,
    Error
  >(
    ['ongoing-support-requests', debouncedSearch],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/support/list?page=${pageParam}&query=${debouncedSearch}&limit=10&status=inProgress`,
        )
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    },
  )
  const dataList = data?.pages?.flatMap((page) => page.docs) ?? []

  useEffect(() => {
    if (dataList.length > 0 && !customer) {
      setCustomer(dataList[0])
    }
  }, [dataList])

  return (
    <>
      <div className='border-b-[0.5px] border-[#CECECE] relative z-10'>
        <BsSearch
          className={clsx(
            'transition-opacity text-gray absolute left-5 -z-10 top-1/2 -translate-y-1/2',
            {
              'opacity-0': !!search,
            },
          )}
          size={22}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='h-20 w-full outline-none bg-transparent pl-5 border-none'
          type='text'
        />
      </div>
      <div
        id='support_list'
        className={clsx('h-[calc(100% - 81px)] overflow-y-auto', {
          'blur-sm animate-pulse': isRefetching,
        })}
      >
        <InfiniteScroll
          dataLength={dataList.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            <div className='flex gap-2 justify-center items-center'>
              <LoaderIcon />
              Loading...
            </div>
          }
          scrollableTarget='support_list'
        >
          {isLoading && (
            <>
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <CustomerListItemCard.Skeleton key={i} />
                ))}
            </>
          )}
          {dataList.map((row) => (
            <CustomerListItemCard
              isActive={row._id === customer?._id}
              onActive={setCustomer}
              data={row}
              key={row._id}
            />
          ))}
        </InfiniteScroll>
      </div>
    </>
  )
}
