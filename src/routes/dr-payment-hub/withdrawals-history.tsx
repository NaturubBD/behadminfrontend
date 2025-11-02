import { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import AnalyticCard from 'components/AnalyticCard'
import NoData from 'components/NoData'
import Badge from 'components/form/Badge'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import paymentInfoModal from 'features/dr-payment-hub/payment-info.modal'
import transferByModal from 'features/dr-payment-hub/transfer-by.modal'
import { useState } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { BsSearch } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery, useQuery } from 'react-query'
import { colorFinder, dateFormatter } from 'utils'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

export default function WithdrawalsHistoryPage({ type }: { type: WithdrawalType }) {
  const transferBy = useModal(transferByModal)
  const paymentInfo = useModal(paymentInfoModal)

  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<
    WithdrawalResponse,
    Error
  >(
    ['withdrawals', debouncedSearchTerm, type],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/withdraw/list?page=${pageParam}&status=${type}&query=${debouncedSearchTerm}`,
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

  const { data: statistics } = useQuery<StatisticsResponse, Error>(
    'withdrawal-statistics',
    async () => {
      try {
        const res = await privateRequest.get('admin/withdraw/statistics')
        return res.data.data
      } catch (error) {
        errorHandler(error)
      }
    },
  )

  const dataList = data?.pages?.flatMap((page) => page.docs) ?? []

  return (
    <>
      {type === 'pending' ? (
        <AnalyticCard
          isLoading={isLoading}
          className='max-w-xs'
          title='Pending Withdrawals'
          value={`${statistics?.totalPendingWithdrawal?.toFixed(2)} Tk.`}
        />
      ) : (
        <AnalyticCard
          isLoading={isLoading}
          className='max-w-xs'
          title='Total Withdrawals'
          value={`${statistics?.totalConfirmedWithdrawal?.toFixed(2) ?? ''} Tk.`}
        />
      )}

      <div className='card mt-6'>
        <div className='flex justify-end mb-10 gap-5'>
          <Input
            variant='outlined'
            placeholder='Name/Phone'
            size='md'
            className='md:!w-[230px] ml-auto'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            afterFix={<BsSearch className='mr-3 text-gray' size={20} />}
          />
        </div>

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
            {}
            <table
              className={clsx({
                'blur-sm animate-pulse': isLoading,
              })}
            >
              <thead>
                <tr>
                  <td>Timestamp</td>
                  <td>Doctor Name</td>
                  <td>Doctor Phone</td>
                  <td>Amount</td>
                  <td>Criteria</td>
                  <td>Note</td>
                  {type !== 'pending' && <td>Transferred By</td>}
                  {type !== 'pending' && <td>Status</td>}
                  {type === 'pending' && <td>Action</td>}
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <>
                    {Array(10)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i}>
                          <td>0000-00-00</td>
                          <td>***** ****</td>
                          <td>123456789</td>
                          <td>0.00 Tk.</td>
                          <td>Withdraw</td>
                          <td>Withdraw amount to 123456789</td>
                          <td className='flex gap-3 w-24'>
                            <Button size='sm'>View</Button>
                            <Button size='sm' variant='outlined'>
                              Transfer
                            </Button>
                          </td>
                        </tr>
                      ))}
                  </>
                )}
                {dataList.map((row) => (
                  <tr key={row._id}>
                    <td className='whitespace-nowrap'>{dateFormatter(row.createdAt)}</td>
                    <td>{row.doctor?.name}</td>
                    <td>{row.doctor?.phone}</td>
                    <td
                      className={clsx({
                        'text-success': row.transactionType === 'credit',
                        'text-danger': row.transactionType === 'debit',
                      })}
                    >
                      {row.amount} Tk.
                    </td>
                    <td className='capitalize'>{row.criteria}</td>
                    <td>{row.note}</td>

                    {type !== 'pending' && <td>{row.transferredBy}</td>}

                    {type !== 'pending' && (
                      <td className='w-24'>
                        <Badge color={colorFinder(row.status)}>{row.status}</Badge>
                      </td>
                    )}

                    {type === 'pending' && (
                      <td className='flex gap-3 w-24'>
                        <Button onClick={() => paymentInfo.show({ data: row.account })} size='sm'>
                          View
                        </Button>
                        <Button
                          onClick={() => transferBy.show({ transaction_id: row._id })}
                          size='sm'
                          variant='outlined'
                        >
                          Transfer
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
          {!dataList?.length && !isLoading && <NoData />}
        </div>
      </div>
    </>
  )
}
