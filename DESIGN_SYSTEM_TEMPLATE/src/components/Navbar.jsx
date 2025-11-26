import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

const Navbar = ({ logo = "Your Logo", navItems = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-bg-secondary border-b border-professional sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-accent-cyan">{logo}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="text-text-secondary hover:text-accent-cyan transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent-cyan/10 transition-colors"
              aria-label="Toggle theme"
            >
              <FontAwesomeIcon
                icon={theme === 'dark' ? faSun : faMoon}
                className="text-accent-lime"
              />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent-cyan/10 transition-colors"
            aria-label="Toggle menu"
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
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={toggleMenu}
                className="block px-4 py-2 text-text-secondary hover:text-accent-cyan hover:bg-accent-cyan/10 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-text-secondary">Theme</span>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent-cyan/10 transition-colors"
                aria-label="Toggle theme"
              >
                <FontAwesomeIcon
                  icon={theme === 'dark' ? faSun : faMoon}
                  className="text-accent-lime"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

