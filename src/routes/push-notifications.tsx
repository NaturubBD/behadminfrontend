import { useModal } from '@ebay/nice-modal-react'
import clsx from 'clsx'
import NoData from 'components/NoData'
import Tabs from 'components/Tabs'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import PushNotificationCard from 'features/push-notification/PushNotificationCard'
import addUpdatePushNotificationModal from 'features/push-notification/add-update-push-notification.modal'
import { useState } from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { BsSearch } from 'react-icons/bs'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfiniteQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

const tabs: NotificationTypeOption[] = [
  {
    label: 'Basic',
    value: 'basic',
  },
  {
    label: 'Standard',
    value: 'standard',
  },
]

type NotificationType = 'standard' | 'basic'
type NotificationTypeOption = {
  label: string
  value: NotificationType
}

export default function PushNotificationsPage() {
  const addUpdatePushNotification = useModal(addUpdatePushNotificationModal)

  const [selected, setSelected] = useState<NotificationTypeOption>(tabs[0])
  const [search, setSearch] = useState<string>('')
  const debouncedSearchTerm = useDebounce(search, 500)

  const { data, fetchNextPage, hasNextPage, isLoading, isRefetching } = useInfiniteQuery<
    NotificationResponse,
    Error
  >(
    ['notifications', debouncedSearchTerm, selected.value],
    async ({ pageParam = 1 }) => {
      try {
        const res = await privateRequest.get(
          `admin/notification?limit=20&page=${pageParam}&query=${debouncedSearchTerm}&type=${selected.value}`,
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
      <div className='flex flex-wrap gap-4'>
        <Tabs
          options={tabs}
          selected={selected}
          selectHandler={(tab) => setSelected(tab as NotificationTypeOption)}
        />
        <Button
          onClick={() => addUpdatePushNotification.show()}
          className='md:ml-auto'
          icon='add'
          variant='outlined'
          size='md'
        >
          Create New
        </Button>
        <Input
          variant='outlined'
          placeholder='Title'
          size='md'
          className='md:!w-[230px]'
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
          <div
            className={clsx('mt-6 grid lg:grid-cols-3 xl:grid-cols-4 gap-6', {
              'blur-sm animate-pulse': isLoading || isRefetching,
            })}
          >
            {isLoading && (
              <>
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <PushNotificationCard.skeleton key={i} />
                  ))}
              </>
            )}
            {dataList.map((row, j) => (
              <PushNotificationCard data={row} key={j} />
            ))}
          </div>
        </InfiniteScroll>
        {dataList.length === 0 && !isLoading && <NoData />}
      </div>
    </div>
  )
}
