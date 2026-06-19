import { createContext } from 'react'

export interface AdminAuthContextValue {
  isAuthenticated: boolean
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const NOT_PROVIDED = Symbol('AdminAuthContext not provided')
type NotProvided = typeof NOT_PROVIDED

export const AdminAuthContext = createContext<AdminAuthContextValue | NotProvided>(
  NOT_PROVIDED
)
export { NOT_PROVIDED }
