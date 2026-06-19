import { useAdminAuth } from '../hooks/useAdminAuth'
import { AdminLogin } from './AdminLogin'
import Admin from '../pages/Admin'

export function ProtectedAdminRoute() {
  const { isAuthenticated } = useAdminAuth()
  return isAuthenticated ? <Admin /> : <AdminLogin />
}
