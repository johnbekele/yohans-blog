import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faBars, faTimes, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-bg-secondary border-b border-accent-cyan/20 sticky top-0 z-50">
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
              to="/blog"
              className="text-text-secondary hover:text-accent-cyan transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/portfolio"
              className="text-text-secondary hover:text-accent-cyan transition-colors"
            >
              Portfolio
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

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium"
              >
                Login
              </Link>
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
              to="/blog"
              onClick={toggleMenu}
              className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/portfolio"
              onClick={toggleMenu}
              className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
            >
              Portfolio
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

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={toggleMenu}
                    className="block px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    toggleMenu()
                  }}
                  className="w-full text-left px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block px-4 py-2 bg-accent-cyan text-bg-primary text-center rounded-lg hover:bg-accent-lime transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

