import clsx from 'clsx'
import NoData from 'components/NoData'
import { privateRequest } from 'config/axios.config'
import AddPromoBannerCard from 'features/promotion/AddPromoBannerCard'
import PromoBannerCard from 'features/promotion/PromoBannerCard'
import { LoaderIcon } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'

export default function PromotionalBannersPage() {
  const { data, fetchNextPage, hasNextPage, isLoading, isRefetching } = useInfiniteQuery<
    BannerResponse,
    Error
  >(
    'banners',
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(`admin/banner?page=${pageParam}`)
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

  return (
    <div id='scrollableDiv' className='h-[calc(100vh-180px)] overflow-y-auto'>
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
        scrollableTarget='scrollableDiv'
      >
        <div
          className={clsx('grid md:grid-cols-2 xl:grid-cols-4 gap-8', {
            'blur-sm animate-pulse': isLoading || isRefetching,
          })}
        >
          {isLoading && (
            <>
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <PromoBannerCard.skeleton key={i} />
                ))}
            </>
          )}
          {dataList.map((row, j) => (
            <PromoBannerCard data={row} key={j} />
          ))}
          <AddPromoBannerCard />
        </div>
      </InfiniteScroll>
      {dataList.length === 0 && !isLoading && <NoData />}
    </div>
  )
}
