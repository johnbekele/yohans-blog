import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/authService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faSpinner, faCheck, faArrowLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await forgotPassword(email)
      setSuccess(true)
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-text-primary">
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <div className="bg-bg-card border border-professional rounded-lg p-8 card-elevated">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-500/10 mb-4">
                <FontAwesomeIcon icon={faCheck} className="text-green-400 text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Check Your Email</h3>
              <p className="text-text-secondary mb-6">
                If an account with that email exists, we've sent a password reset link.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center text-accent-cyan hover:text-accent-lime transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="text-text-secondary" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary placeholder-text-secondary"
                    placeholder="you@example.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 flex items-start space-x-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="mt-0.5" />
                    <span>{error}</span>
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faEnvelope} />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-accent-cyan hover:text-accent-lime transition-colors text-sm"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

