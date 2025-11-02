import { HiOutlineArrowLeft } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

type Props = {
  prevPage: string
  title: string
}

export default function BreadCrumb({ prevPage, title }: Props) {
  return (
    <div>
      <Link className='inline-flex gap-3 items-center font-medium text-lg' to={prevPage}>
        <HiOutlineArrowLeft /> {title}
      </Link>
    </div>
  )
}
