export default function ExperienceCard({ data }: { data: Experience }) {
  return (
    <div className='border border-gray-4 rounded-2xl p-6'>
      <h4>{data.hospitalName}</h4>
      <div className='grid grid-cols-2 gap-5 mt-6'>
        <div>
          <h6 className='text-sm text-gray mb-1'>Designation</h6>
          <h5 className='text-sm font-medium'>{data.designation}</h5>
        </div>
      </div>
    </div>
  )
}
