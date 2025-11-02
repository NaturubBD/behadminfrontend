import { privateRequest } from 'config/axios.config'
import { useQuery } from 'react-query'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { errorHandler } from 'utils/errorHandler'

import AnalyticCard from 'components/AnalyticCard'
import Devider from 'components/Devider'
import Select from 'components/form/select'
import CardTitle from 'components/title/cardTitle'
import { useState } from 'react'
import { amountFormatter, tickFormatter } from 'utils'

const durationOptions: Option[] = [
  { label: 'Last Year', value: '365' },
  { label: 'Last Month', value: '30' },
  { label: 'Last Week', value: '7' },
]

const months = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function ProfitPage() {
  const [duration, setDuration] = useState<Option>(durationOptions[0])

  const { data, isLoading } = useQuery<ProfitStatistics>('profit', async () => {
    try {
      const res = await privateRequest.get('admin/profit/statistics')
      return res.data.data
    } catch (err) {
      errorHandler(err)
    }
  })

  const { data: chartData } = useQuery<{ month: number; profit: number }[], Error>(
    ['dashboard-chartData', duration],
    async () => {
      try {
        const res = await privateRequest.get('admin/profit/chartData')
        return res.data.chartData
      } catch (error) {
        errorHandler(error)
      }
    },
  )

  return (
    <div>
      <div className='grid md:grid-cols-2 gap-5'>
        <AnalyticCard
          isLoading={isLoading}
          title='Total Sales'
          value={`${amountFormatter(data?.totalSales)} Tk.`}
        />
        <AnalyticCard
          isLoading={isLoading}
          title='EyeBuddy Get'
          value={`${amountFormatter(data?.eyebuddy)} Tk.`}
        />
        <AnalyticCard
          isLoading={isLoading}
          title='Doctor’s Payment'
          value={`${amountFormatter(data?.doctor)} Tk.`}
        />
        <AnalyticCard
          isLoading={isLoading}
          title='Profit'
          value={`${amountFormatter(data?.profit)} Tk.`}
        />
      </div>
      <Devider />
      <div className='card'>
        <div className='sm:flex justify-between gap-4'>
          <CardTitle title='Profit Chart' />
          <Select
            options={durationOptions}
            value={duration}
            onChange={(value) => setDuration(value.target.value)}
          />
        </div>
        <div className='h-96'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              width={500}
              height={400}
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#008541' stopOpacity={0.4} />
                  <stop offset='95%' stopColor='#008541' stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                }}
                axisLine={false}
                tickLine={false}
                dataKey='month'
                tickMargin={10}
                tickFormatter={(value) => months[value]}
              />
              <YAxis
                style={{
                  fontSize: '14px',
                  fontWeight: 400,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={tickFormatter}
              />
              <Tooltip
                labelFormatter={(value) => months[value]}
                formatter={(value) => [`${amountFormatter(Number(value))} Tk.`, 'Profit']}
              />

              <Area
                type='monotone'
                dataKey='profit'
                stroke='#008541'
                strokeWidth={3.3}
                fillOpacity={1}
                fill='url(#colorUv)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
