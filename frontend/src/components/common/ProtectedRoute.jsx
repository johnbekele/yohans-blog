import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

