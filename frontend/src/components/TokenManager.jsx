import { useState, useEffect } from 'react'
import { saveToken, getTokenStatus, removeToken } from '../services/tokenService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faKey,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
  faEye,
  faEyeSlash,
  faTrash,
  faShieldAlt,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons'

const TokenManager = ({ onTokenSaved }) => {
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setChecking(true)
    try {
      const result = await getTokenStatus()
      setStatus(result)
      if (result.has_token && result.token_valid) {
        setSuccess('Token is valid and ready to use!')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to check token status')
    } finally {
      setChecking(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    if (!token.trim()) {
      setError('Please enter your Open Arena ESSO token')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await saveToken(token.trim())
      setSuccess(result.message || 'Token saved successfully!')
      setToken('')
      setStatus(result)
      if (onTokenSaved) {
        onTokenSaved()
      }
      // Refresh status after a moment
      setTimeout(() => {
        checkStatus()
      }, 1000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save token. Please check if the token is valid.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    if (!window.confirm('Are you sure you want to remove your token? You will need to add it again to use AI features.')) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await removeToken()
      setSuccess('Token removed successfully')
      setStatus({ has_token: false, token_valid: false })
      if (onTokenSaved) {
        onTokenSaved()
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to remove token')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg-card p-8 rounded-lg border border-accent-cyan/20">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-accent-cyan/10 rounded-lg mr-4">
          <FontAwesomeIcon icon={faShieldAlt} className="text-2xl text-accent-cyan" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Open Arena Token</h2>
          <p className="text-text-secondary text-sm">Manage your ESSO authentication token</p>
        </div>
      </div>

      {/* Status Check */}
      {checking ? (
        <div className="mb-6 p-4 bg-bg-secondary rounded-lg border border-accent-cyan/20">
          <div className="flex items-center space-x-3">
            <FontAwesomeIcon icon={faSpinner} className="animate-spin text-accent-cyan" />
            <span className="text-text-secondary">Checking token status...</span>
          </div>
        </div>
      ) : status && (
        <div className={`mb-6 p-4 rounded-lg border ${
          status.token_valid 
            ? 'bg-green-500/10 border-green-500/20' 
            : status.has_token 
            ? 'bg-yellow-500/10 border-yellow-500/20'
            : 'bg-bg-secondary border-accent-cyan/20'
        }`}>
          <div className="flex items-start space-x-3">
            {status.token_valid ? (
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xl mt-1" />
            ) : status.has_token ? (
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-xl mt-1" />
            ) : (
              <FontAwesomeIcon icon={faInfoCircle} className="text-accent-cyan text-xl mt-1" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${
                status.token_valid ? 'text-green-400' : status.has_token ? 'text-yellow-400' : 'text-text-secondary'
              }`}>
                {status.message || (status.token_valid ? 'Token is valid' : status.has_token ? 'Token is expired' : 'No token saved')}
              </p>
              {status.has_token && !status.token_valid && (
                <p className="text-text-secondary text-sm mt-2">
                  Your token has expired. Please add a new token to continue using AI features.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Token Input Form */}
      {(!status?.has_token || !status?.token_valid) && (
        <form onSubmit={handleSave} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-text-primary">
              <FontAwesomeIcon icon={faKey} className="mr-2 text-accent-cyan" />
              Open Arena ESSO Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your ESSO token here..."
                className="w-full px-4 py-3 pr-12 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary placeholder:text-text-secondary"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-accent-cyan transition-colors"
                disabled={loading}
              >
                <FontAwesomeIcon icon={showToken ? faEyeSlash : faEye} />
              </button>
            </div>
            <p className="text-xs text-text-secondary mt-2 flex items-start space-x-1">
              <FontAwesomeIcon icon={faInfoCircle} className="mt-0.5" />
              <span>
                Get your token from Open Arena AI Platform → Developer Tools → Network → Find 'user' request → Headers → Authorization
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || !token.trim()}
            className="w-full py-3 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Validating & Saving...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faKey} />
                <span>Save & Validate Token</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Remove Token Button */}
      {status?.has_token && (
        <div className="mb-4">
          <button
            onClick={handleRemove}
            disabled={loading}
            className="w-full py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={faTrash} />
            <span>Remove Token</span>
          </button>
        </div>
      )}

      {/* Refresh Status Button */}
      <button
        onClick={checkStatus}
        disabled={loading || checking}
        className="w-full py-2 bg-bg-secondary text-text-secondary rounded-lg hover:bg-accent-cyan/10 hover:text-accent-cyan transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        <FontAwesomeIcon icon={faSpinner} className={checking ? 'animate-spin' : ''} />
        <span>Refresh Status</span>
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 flex items-start space-x-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mt-0.5" />
            <span>{error}</span>
          </p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 flex items-start space-x-2">
            <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5" />
            <span>{success}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default TokenManager

