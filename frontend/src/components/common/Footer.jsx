import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faHeart } from '@fortawesome/free-solid-svg-icons'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bg-secondary border-t border-accent-cyan/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-accent-cyan mb-4">
              John Bekele
            </h3>
            <p className="text-text-secondary mb-4">
              Application Support Analyst & Freelance Web Developer passionate
              about DevOps, Cloud Infrastructure, and LLM technologies.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/johnbekele"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-cyan transition-colors"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>
              <a
                href="https://www.linkedin.com/in/yohans-bekele"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent-cyan transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>
              <a
                href="mailto:yohans.Bekele@thomsonreuters.com"
                className="text-text-secondary hover:text-accent-cyan transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-accent-lime mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-text-secondary hover:text-accent-cyan transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-text-secondary hover:text-accent-cyan transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-text-secondary hover:text-accent-cyan transition-colors"
                >
                  Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter/Contact */}
          <div>
            <h3 className="text-xl font-bold text-accent-lime mb-4">
              Get in Touch
            </h3>
            <p className="text-text-secondary mb-4">
              Interested in collaboration or have a project idea? Let's connect!
            </p>
            <Link
              to="/portfolio#contact"
              className="inline-block px-6 py-2 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium"
            >
              Contact Me
            </Link>
          </div>
        </div>

        <div className="border-t border-accent-cyan/20 mt-8 pt-8 text-center">
          <p className="text-text-secondary">
            © {currentYear} Yohans (John) Bekele. Made with{' '}
            <FontAwesomeIcon icon={faHeart} className="text-red-500" /> using
            React, FastAPI & MongoDB
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

