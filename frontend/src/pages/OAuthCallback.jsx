import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { oauthCallback } from '../services/authService'

const OAuthCallback = () => {
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      
      if (!code) {
        setError('Authorization code not found')
        setLoading(false)
        return
      }

      try {
        const data = await oauthCallback(code)
        setUser(data.user)
        navigate('/admin', { replace: true })
      } catch (err) {
        const errorMessage = err.response?.data?.detail || err.message || 'OAuth authentication failed'
        console.error('OAuth callback error:', err)
        setError(errorMessage)
        setLoading(false)
      }
    }

    handleCallback()
  }, [searchParams, navigate, setUser])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="loading w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-text-secondary">Completing authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-4">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default OAuthCallback

