import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any route that requires login. Pass adminOnly to also require ROLE_ADMIN.
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" replace />
  }
  return children
}
