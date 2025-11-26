import { useState } from 'react'
import { changePassword } from '../services/authService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faSpinner, faCheck, faExclamationTriangle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const ChangePassword = ({ onSuccess }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password')
      return
    }

    setLoading(true)

    try {
      await changePassword(currentPassword, newPassword)
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      if (onSuccess) {
        onSuccess()
      }
      
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password. Please check your current password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg-card border border-professional rounded-lg p-8 card-elevated">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-accent-cyan/10 rounded-lg mr-4">
          <FontAwesomeIcon icon={faKey} className="text-2xl text-accent-cyan" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Change Password</h2>
          <p className="text-text-secondary text-sm">Update your account password</p>
        </div>
      </div>

      {success ? (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 flex items-center space-x-2">
            <FontAwesomeIcon icon={faCheck} />
            <span>Password changed successfully!</span>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faKey} className="text-text-secondary" />
              </div>
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
                placeholder="Enter current password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-accent-cyan"
              >
                <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faKey} className="text-text-secondary" />
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
                placeholder="Enter new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-accent-cyan"
              >
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <p className="text-xs text-text-secondary mt-1">Must be at least 6 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faKey} className="text-text-secondary" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="block w-full pl-10 pr-10 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
                placeholder="Confirm new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-secondary hover:text-accent-cyan"
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </button>
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
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="w-full py-3 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Changing Password...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faKey} />
                <span>Change Password</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}

export default ChangePassword

