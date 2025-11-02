declare type SVGTYPE = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined
  }
>
type _ChangeHandlerEventInput = React.ChangeEvent<HTMLInputElement>
type _ChangeHandlerEvent = ChangeEvent<HTMLInputElement>
type _FormSubmitEvent = React.FormEvent<HTMLFormElement>
type _SelectValue = { target: { value: Option; name: string } }

type Option = {
  label: string
  value: string
}

type TabOption = { label: JSX.Element | string; value: string }

type ButtonColorType = 'primary' | 'success' | 'warning' | 'danger' | 'default'

type IconBaseProps = React.SVGAttributes<SVGElement> & {
  children?: React.ReactNode
  size?: string | number
  color?: string
  title?: string
}

type DrawerLink = {
  label: string
  link: string
  child?: DrawerChild
  icon: (props: IconBaseProps) => JSX.Element
}

type DrawerChild = Omit<DrawerLink, 'icon'>[]

type StatusColor = 'success' | 'warning' | 'danger' | 'info'

declare module '*.png'
declare module '*.svg'
declare module '*.jpg'
declare module '*.mp4'

type Gender = 'male' | 'female' | 'none'
