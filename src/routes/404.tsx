import { Link } from 'react-router-dom'

export default function PageNotFound() {
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-3xl font-bold mb-4'>Oops!</h1>
        <h2 className='text-xl font-semibold mb-4'>
          We could not find the page you were looking for.
        </h2>
        <p className='mb-4'>
          Please check the URL or go back to the{' '}
          <Link to='/' className='text-primary hover:underline'>
            Home
          </Link>
          .
        </p>
        <Link to='/' className='bg-primary text-white px-4 py-2 rounded-lg'>
          Go Back
        </Link>
      </div>
    </div>
  )
}
