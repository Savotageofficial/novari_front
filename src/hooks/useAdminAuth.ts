import { useContext } from 'react'
import { AdminAuthContext, NOT_PROVIDED } from '../context/AdminAuthContext'

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === NOT_PROVIDED) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
