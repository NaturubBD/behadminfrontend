import clsx from 'clsx'
import NoData from 'components/NoData'
import { privateRequest } from 'config/axios.config'
import { LoaderIcon } from 'react-hot-toast'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'

export default function ResolvedPage() {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    SupportRequestResponse,
    Error
  >(
    'resolved-support-requests',
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/support/list?page=${pageParam}&limit=20&status=resolved`,
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

  return (
    <div id='scrollableDiv' className='h-[calc(100vh-170px)] overflow-y-auto'>
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
        <table
          className={clsx({
            'blur-sm animate-pulse': isLoading,
          })}
        >
          <thead>
            <tr>
              <td>Timestamp</td>
              <td>Name</td>
              <td>Phone Number</td>
              <td>Total Appointment</td>
              <td>Note</td>
              <td>Customer Executive</td>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <>
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <tr key={i}>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                      <td>--</td>
                    </tr>
                  ))}
              </>
            )}
            {dataList.map((row) => (
              <tr key={row._id}>
                <td>{dateFormatter(row.createdAt)}</td>
                <td>{row.user.name}</td>
                <td>
                  <span className='select-none text-slate-500'>0</span>
                  {row.user.phone}
                </td>
                <td>{row.user.totalConsultationCount}</td>
                <td className='capitalize'>{row?.resolveNote}</td>
                <td className='capitalize'>{row?.admin.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
      {!dataList?.length && !isLoading && <NoData />}
    </div>
  )
}
