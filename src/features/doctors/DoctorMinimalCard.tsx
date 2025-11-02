export default function DoctorMinimalCard({ doctor }: { doctor: DoctorDetails }) {
  return (
    <div className='card flex items-center !bg-primary/20 gap-2'>
      {doctor?.photo && (
        <img
          src={doctor?.photo}
          className='h-24 w-24 rounded-full overflow-hidden object-cover border border-light-gray'
        />
      )}
      <div>
        <h3 className='font-medium'>
          {doctor.name}{' '}
          {doctor.hospital?.name && <span className='text-primary'>({doctor.hospital?.name})</span>}
        </h3>
        <p className='text-sm'>{doctor.specialty?.title}</p>
        <p className='text-xs font-medium'>
          {doctor.experienceInYear} {doctor.experienceInYear > 1 ? 'Years' : 'year'} Experience
        </p>
      </div>
    </div>
  )
}
