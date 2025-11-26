import { useState, useEffect } from 'react'
import { getPortfolio, updatePersonalInfo } from '../services/portfolioService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faImage, faEnvelope, faUser, faSpinner } from '@fortawesome/free-solid-svg-icons'

const ProfileManagement = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    // Logo
    logo_text: 'JB',
    logo_image: '',
    use_logo_image: false,
    
    // Personal Info
    name: '',
    email: '',
    github: '',
    linkedin: '',
    
    // Footer
    footer_name: '',
    footer_about: '',
    footer_contact_text: '',
    footer_contact_button: '',
    footer_contact_link: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const portfolio = await getPortfolio()
      const { personal_info, footer } = portfolio
      
      setFormData({
        logo_text: footer?.logo_text || 'JB',
        logo_image: footer?.logo_image || '',
        use_logo_image: !!footer?.logo_image,
        name: personal_info.name,
        email: personal_info.email,
        github: personal_info.github,
        linkedin: personal_info.linkedin,
        footer_name: footer?.name || personal_info.name,
        footer_about: footer?.about_text || '',
        footer_contact_text: footer?.contact_text || '',
        footer_contact_button: footer?.contact_button_text || 'Contact Me',
        footer_contact_link: footer?.contact_link || '/contact',
      })
    } catch (err) {
      setError('Failed to load profile data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      // Update personal info
      await updatePersonalInfo({
        name: formData.name,
        email: formData.email,
        github: formData.github,
        linkedin: formData.linkedin,
      })

      // Update footer (will need to add this endpoint)
      // await updateFooter({...})

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="loading w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Logo Section */}
      <div className="bg-bg-card border border-professional rounded-lg p-6 card-elevated">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Logo Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Logo Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!formData.use_logo_image}
                  onChange={() => setFormData({...formData, use_logo_image: false})}
                  className="mr-2"
                />
                <span className="text-text-secondary">Use Text</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={formData.use_logo_image}
                  onChange={() => setFormData({...formData, use_logo_image: true})}
                  className="mr-2"
                />
                <span className="text-text-secondary">Use Image</span>
              </label>
            </div>
          </div>

          {!formData.use_logo_image ? (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Logo Text
              </label>
              <input
                type="text"
                value={formData.logo_text}
                onChange={(e) => setFormData({...formData, logo_text: e.target.value})}
                maxLength={10}
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
                placeholder="JB"
              />
              <p className="text-xs text-text-secondary mt-1">Preview: <span className="text-2xl font-bold text-accent-cyan">{formData.logo_text || 'JB'}</span></p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Logo Image URL
              </label>
              <input
                type="url"
                value={formData.logo_image}
                onChange={(e) => setFormData({...formData, logo_image: e.target.value})}
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
                placeholder="https://..."
              />
              {formData.logo_image && (
                <div className="mt-4">
                  <img src={formData.logo_image} alt="Logo preview" className="h-16 w-auto" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-bg-card border border-professional rounded-lg p-6 card-elevated">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Personal Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({...formData, github: e.target.value})}
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
                placeholder="https://github.com/..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Information */}
      <div className="bg-bg-card border border-professional rounded-lg p-6 card-elevated">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Footer Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Footer Name
            </label>
            <input
              type="text"
              value={formData.footer_name}
              onChange={(e) => setFormData({...formData, footer_name: e.target.value})}
              className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              About Text
            </label>
            <textarea
              value={formData.footer_about}
              onChange={(e) => setFormData({...formData, footer_about: e.target.value})}
              rows="3"
              className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
              placeholder="Brief description for footer..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Contact Section Text
            </label>
            <textarea
              value={formData.footer_contact_text}
              onChange={(e) => setFormData({...formData, footer_contact_text: e.target.value})}
              rows="2"
              className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
              placeholder="Contact section description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Contact Button Text
              </label>
              <input
                type="text"
                value={formData.footer_contact_button}
                onChange={(e) => setFormData({...formData, footer_contact_button: e.target.value})}
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Contact Link
              </label>
              <input
                type="text"
                value={formData.footer_contact_link}
                onChange={(e) => setFormData({...formData, footer_contact_link: e.target.value})}
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan text-text-primary"
                placeholder="/contact"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
          >
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} />
                <span>Save Footer</span>
              </>
            )}
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400">Profile updated successfully!</p>
        </div>
      )}
    </div>
  )
}

export default ProfileManagement

