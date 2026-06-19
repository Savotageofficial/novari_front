import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { adminLogin as apiAdminLogin, adminLogout as apiAdminLogout } from '../api/admin'
import { AdminAuthContext } from './AdminAuthContext'

const STORAGE_KEY = 'novari:admin:token'

function readToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readToken())

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (token) {
      window.localStorage.setItem(STORAGE_KEY, token)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [token])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiAdminLogin(email.trim(), password)
      setToken(response.token)
      return true
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    if (token) {
      void apiAdminLogout(token).catch(() => {})
    }
    setToken(null)
  }, [token])

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated: token !== null,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}
