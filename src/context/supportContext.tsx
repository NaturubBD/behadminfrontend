import { createContext, useState } from 'react'
import useSocketSetup from 'socket/useSocketSetup'

type SupportContextType = {
  customer: SupportRequest | null
  setCustomer: (customer: SupportRequest | null) => void
}

export const SupportContext = createContext<SupportContextType>({
  customer: null,
} as SupportContextType)

export default function SupportContextProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<SupportRequest | null>(null)

  useSocketSetup()

  return (
    <SupportContext.Provider value={{ customer, setCustomer }}>{children}</SupportContext.Provider>
  )
}
