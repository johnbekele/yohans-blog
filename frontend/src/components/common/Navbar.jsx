import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMoon, faSun, faBars, faTimes, faUser, faSignOutAlt, 
  faKey, faCog, faBriefcase, faFileAlt, faChevronDown 
} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const toggleMenu = () => setIsOpen(!isOpen)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAdminDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsAdminDropdownOpen(false)
  }

  return (
    <nav className="bg-bg-secondary border-b border-professional sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-accent-cyan">JB</span>
            <span className="text-xl font-semibold">Blog</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-text-secondary hover:text-accent-cyan transition-colors"
            >
              Home
            </Link>
            <Link
              to="/contact"
              className="text-text-secondary hover:text-accent-cyan transition-colors"
            >
              Contact
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent-cyan/10 transition-colors"
            >
              <FontAwesomeIcon
                icon={theme === 'dark' ? faSun : faMoon}
                className="text-accent-lime"
              />
            </button>

            {/* Admin Dropdown */}
            {isAuthenticated && user?.role === 'admin' && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors flex items-center space-x-2"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Admin</span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-xs transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isAdminDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-bg-card border border-professional rounded-lg shadow-lg py-2 z-50">
                    <Link
                      to="/admin/posts"
                      onClick={() => setIsAdminDropdownOpen(false)}
                      className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors flex items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faFileAlt} />
                      <span>Posts</span>
                    </Link>
                    <Link
                      to="/admin/portfolio"
                      onClick={() => setIsAdminDropdownOpen(false)}
                      className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors flex items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faBriefcase} />
                      <span>Portfolio</span>
                    </Link>
                    <Link
                      to="/admin/profile"
                      onClick={() => setIsAdminDropdownOpen(false)}
                      className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors flex items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faCog} />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/admin/token"
                      onClick={() => setIsAdminDropdownOpen(false)}
                      className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors flex items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faKey} />
                      <span>Token</span>
                    </Link>
                    <div className="border-t border-accent-cyan/20 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent-cyan/10 transition-colors"
          >
            <FontAwesomeIcon
              icon={isOpen ? faTimes : faBars}
              className="text-accent-cyan text-xl"
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              onClick={toggleMenu}
              className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
            >
              Contact
            </Link>

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-text-secondary">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent-cyan/10 transition-colors"
              >
                <FontAwesomeIcon
                  icon={theme === 'dark' ? faSun : faMoon}
                  className="text-accent-lime"
                />
              </button>
            </div>

            {/* Admin Section - Mobile */}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link
                  to="/admin/posts"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                  Posts
                </Link>
                <Link
                  to="/admin/portfolio"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faBriefcase} className="mr-2" />
                  Portfolio
                </Link>
                <Link
                  to="/admin/profile"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faCog} className="mr-2" />
                  Profile
                </Link>
                <Link
                  to="/admin/token"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faKey} className="mr-2" />
                  Token
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    toggleMenu()
                  }}
                  className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

