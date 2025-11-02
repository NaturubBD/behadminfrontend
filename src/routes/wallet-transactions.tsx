import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'

import clsx from 'clsx'
import BreadCrumb from 'components/BreadCrumb'
import Devider from 'components/Devider'
import NoData from 'components/NoData'
import { privateRequest } from 'config/axios.config'
import { LoaderIcon } from 'react-hot-toast'
import { amountFormatter, dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import { StatusColorFinder } from 'utils/StatusColorFinder'

type Props = {
  type: OwnerType
}

export default function WalletTransactionsPage({ type }: Props) {
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    WalletTransactionResponse,
    Error
  >(
    ['wallet-transactions', type],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/wallet/transactions?limit=20&page=${pageParam}&type=${type}`,
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
    <div className='card'>
      <BreadCrumb prevPage='/wallet' title='Wallet' />
      <Devider />
      <div id='scrollableDiv' className='h-[calc(100vh-325px)] overflow-y-auto'>
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
                <td>Joined date</td>
                <td>Type</td>
                {type !== 'eyeBuddy' && <td>Account</td>}
                <td>Amount</td>
                <td>Note</td>
                <td>Transferred By</td>
                <td>Status</td>
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <>
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td>Day Month, Year</td>
                        <td>NOCODE</td>
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
                  <td className='whitespace-nowrap'>{dateFormatter(row.createdAt)}</td>
                  <td className='capitalize'>{row.criteria}</td>
                  {type !== 'eyeBuddy' && <td>{row?.owner?.name}</td>}
                  <td
                    className={clsx({
                      'text-success': row.transactionType === 'credit',
                      'text-danger': row.transactionType === 'debit',
                    })}
                  >
                    {amountFormatter(row.amount)} Tk.
                  </td>
                  <td>{row.note}</td>
                  <td className='capitalize'>{row.transferredBy}</td>
                  <td className={`capitalize ${StatusColorFinder(row.status)}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
        {!dataList?.length && !isLoading && <NoData />}
      </div>
    </div>
  )
}
