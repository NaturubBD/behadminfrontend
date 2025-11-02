import { useModal } from '@ebay/nice-modal-react'
import NoData from 'components/NoData'
import Tabs from 'components/Tabs'
import Button from 'components/form/button'
import Input from 'components/form/input'
import { privateRequest } from 'config/axios.config'
import PromoCard from 'features/promotion/PromoCard'
import addNewPromoModal from 'features/promotion/add-promo.modal'
import { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useQuery } from 'react-query'
import { errorHandler } from 'utils/errorHandler'
import useDebounce from 'utils/useDebounce'

const tabs: TabOption[] = [
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Expired',
    value: 'inactive',
  },
]

export default function PromoCodePage() {
  const [selected, setSelected] = useState<TabOption>(tabs[0])
  const addNewPromo = useModal(addNewPromoModal)

  const [filter, setFilter] = useState<{
    search: string
  }>({
    search: '',
  })

  const [search, setSearch] = useState<string>('')

  const { data, isLoading, isRefetching } = useQuery<{ docs: Promo[] }, Error>(
    ['get-pormos', filter.search, selected.value],
    async () => {
      try {
        const res = await privateRequest.get(
          `/admin/promo?query=${filter.search}&status=${selected.value}`,
        )
        return res.data.data
      } catch (err) {
        errorHandler(err)
      }
    },
  )

  const debouncedSearchTerm = useDebounce(search, 500)

  useEffect(() => {
    setFilter((prev) => ({ ...prev, search: debouncedSearchTerm }))
  }, [debouncedSearchTerm])

  return (
    <div className='card'>
      <div className='flex flex-wrap gap-4'>
        <Tabs options={tabs} selected={selected} selectHandler={(tab) => setSelected(tab)} />
        <Button
          onClick={() => addNewPromo.show()}
          className='md:ml-auto'
          icon='add'
          variant='outlined'
          size='md'
        >
          Create New
        </Button>
        <Input
          variant='outlined'
          placeholder='Search'
          size='md'
          className='!w-[230px]'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          afterFix={<BsSearch className='mr-3 text-gray' size={20} />}
        />
      </div>

      <div className='mt-6 grid lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {data?.docs?.map((promo) => (
          <PromoCard
            className={isRefetching ? 'blur-sm animate-pulse' : ''}
            key={promo._id}
            promo={promo}
          />
        ))}
        {isLoading && (
          <>
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <PromoCard.skeleton key={i} />
              ))}
          </>
        )}
      </div>

      {data?.docs?.length === 0 && <NoData />}
    </div>
  )
}
