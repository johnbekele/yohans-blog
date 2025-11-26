import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPaperPlane, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-bg-primary py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="text-accent-cyan">Touch</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-bg-secondary p-8 rounded-lg border border-accent-cyan/20">
              <h2 className="text-2xl font-bold mb-6 text-accent-lime">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <FontAwesomeIcon icon={faEnvelope} className="text-accent-cyan text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a href="mailto:yohans.bekele@thomsonreuters.com" className="text-text-secondary hover:text-accent-cyan">
                      yohans.bekele@thomsonreuters.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-accent-cyan text-xl mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-text-secondary">Remote / Hybrid Work</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-accent-cyan/20">
                <h3 className="font-semibold mb-4">Connect With Me</h3>
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/johnbekele"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-accent-cyan/10 rounded-lg hover:bg-accent-cyan/20 transition-colors"
                  >
                    <FontAwesomeIcon icon={faGithub} className="text-accent-cyan text-2xl" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/yohans-bekele"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-accent-cyan/10 rounded-lg hover:bg-accent-cyan/20 transition-colors"
                  >
                    <FontAwesomeIcon icon={faLinkedin} className="text-accent-cyan text-2xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Admin Login Link */}
            <div className="bg-bg-secondary p-6 rounded-lg border border-accent-cyan/20">
              <p className="text-sm text-text-secondary mb-2">Admin Access</p>
              <a
                href="/login"
                className="text-accent-cyan hover:text-accent-lime transition-colors text-sm"
              >
                → Login to Admin Dashboard
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg-secondary p-8 rounded-lg border border-accent-cyan/20">
            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
            
            {submitted && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400">Thank you! Your message has been sent.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bg-primary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bg-primary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-bg-primary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full px-4 py-3 bg-bg-primary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

