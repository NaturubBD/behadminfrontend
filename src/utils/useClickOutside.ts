import { useEffect } from 'react'

const useClickOutside = (ref: any, handler: () => void) => {
  useEffect(() => {
    let startedInside: HTMLDivElement | boolean = false
    let startedWhenMounted: HTMLDivElement | boolean = false

    const listener = (event: any) => {
      if (startedInside || !startedWhenMounted) return
      if (!ref.current || ref.current.contains(event.target)) return
      handler()
    }

    const validateEventStart = (event: any) => {
      startedWhenMounted = ref.current
      startedInside = ref.current && ref.current.contains(event.target)
    }

    document.addEventListener('mousedown', validateEventStart)
    document.addEventListener('touchstart', validateEventStart)
    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('mousedown', validateEventStart)
      document.removeEventListener('touchstart', validateEventStart)
      document.removeEventListener('click', listener)
    }
  }, [ref, handler])
}

export default useClickOutside
