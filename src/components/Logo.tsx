import logo from 'images/logo.png'

type Props = {
  className?: string
}

export default function Logo({ className }: Props) {
  return <img className={className} src={logo} alt='' />
}
