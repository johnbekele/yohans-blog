import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-accent-cyan">Admin</span> Login
          </h1>
          <p className="text-text-secondary">
            Sign in to manage your blog content
          </p>
        </div>

        <div className="bg-bg-card p-8 rounded-lg border border-accent-cyan/20">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="admin@blog.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                  <FontAwesomeIcon icon={faLock} />
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-sm text-accent-cyan hover:text-accent-lime transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="loading w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full"></div>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-accent-lime hover:text-accent-cyan transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 p-4 bg-bg-secondary rounded-lg border border-accent-lime/20">
          <p className="text-sm text-text-secondary">
            <strong className="text-accent-lime">Demo Credentials:</strong>
            <br />
            Email: admin@blog.com
            <br />
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

