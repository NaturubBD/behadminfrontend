import noData from 'images/no-data.svg'

const NoData = () => {
  return (
    <div className='flex-1 pt-[3.3906rem] pb-[1.2319rem]'>
      <div
        style={{
          position: 'relative',
          width: '7.8081rem',
          height: '6.9819rem',
          margin: 'auto',
        }}
      >
        <img src={noData} alt='no data' />
      </div>
      <p className='text-center font-manrope text-[0.875rem] leading-[1.1875rem] text-gray not-italic font-medium pt-3'>
        No Data
      </p>
    </div>
  )
}

export default NoData
