import { useState, useEffect } from 'react'
import { getPortfolio } from '../services/portfolioService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGithub,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faExternalLinkAlt,
  faCode,
} from '@fortawesome/free-solid-svg-icons'

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeExp, setActiveExp] = useState(0)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio()
      setPortfolio(data)
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-secondary">Portfolio data not available</p>
      </div>
    )
  }

  const { personal_info, skills, projects, experience } = portfolio

  return (
    <div className="min-h-screen">
      {/* About Section */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="text-accent-cyan">{personal_info.name}</span>
              </h1>
              <h2 className="text-2xl text-accent-lime mb-6">
                {personal_info.role}
              </h2>
              <p className="text-text-secondary text-lg mb-6">
                {personal_info.bio}
              </p>
              <div className="flex space-x-4">
                <a
                  href={personal_info.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-bg-card border border-accent-cyan/20 rounded-lg hover:bg-accent-cyan/10 transition-colors"
                >
                  <FontAwesomeIcon icon={faGithub} className="mr-2" />
                  GitHub
                </a>
                <a
                  href={personal_info.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-bg-card border border-accent-lime/20 rounded-lg hover:bg-accent-lime/10 transition-colors"
                >
                  <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
                  LinkedIn
                </a>
                <a
                  href={`mailto:${personal_info.email}`}
                  className="px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  Contact
                </a>
              </div>
            </div>
            <div className="bg-bg-card p-8 rounded-lg border border-accent-cyan/20">
              <h3 className="text-2xl font-bold mb-4 text-accent-lime">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-text-secondary">Experience</p>
                  <p className="text-2xl font-bold">5+ Years</p>
                </div>
                <div>
                  <p className="text-text-secondary">Projects</p>
                  <p className="text-2xl font-bold">10+ Deployed</p>
                </div>
                <div>
                  <p className="text-text-secondary">Uptime</p>
                  <p className="text-2xl font-bold">99.9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="text-accent-cyan">Skills</span> & Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skillCat, idx) => (
              <div
                key={idx}
                className="bg-bg-card p-6 rounded-lg border border-accent-cyan/20"
              >
                <div className="text-4xl mb-4">{skillCat.icon}</div>
                <h3 className="text-xl font-bold mb-4">{skillCat.category}</h3>
                <div className="space-y-3">
                  {skillCat.skills.map((skill, sidx) => (
                    <div key={sidx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{skill.name}</span>
                        <span className="text-sm text-accent-cyan">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-bg-secondary rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-accent-cyan to-accent-lime h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Featured <span className="text-accent-lime">Projects</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="bg-bg-card rounded-lg overflow-hidden border border-accent-cyan/20 hover:shadow-xl hover:shadow-accent-cyan/10 transition-all"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-accent-lime mb-4">{project.subtitle}</p>
                  <p className="text-text-secondary mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech, tidx) => (
                      <span
                        key={tidx}
                        className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors"
                      >
                        <FontAwesomeIcon
                          icon={faExternalLinkAlt}
                          className="mr-2"
                        />
                        Demo
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-bg-secondary border border-accent-cyan/20 rounded-lg hover:bg-accent-cyan/10 transition-colors"
                      >
                        <FontAwesomeIcon icon={faCode} className="mr-2" />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Work <span className="text-accent-cyan">Experience</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 space-y-2">
              {experience.map((exp, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveExp(idx)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeExp === idx
                      ? 'bg-accent-cyan text-bg-primary'
                      : 'bg-bg-card hover:bg-accent-cyan/10'
                  }`}
                >
                  {exp.company}
                </button>
              ))}
            </div>
            <div className="lg:col-span-3 bg-bg-card p-8 rounded-lg border border-accent-cyan/20">
              <h3 className="text-2xl font-bold mb-2">
                {experience[activeExp].role}
              </h3>
              <p className="text-accent-lime mb-2">
                {experience[activeExp].company} | {experience[activeExp].type}
              </p>
              <p className="text-text-secondary mb-4">
                {experience[activeExp].duration} | {experience[activeExp].location}
              </p>
              <p className="text-text-secondary mb-6">
                {experience[activeExp].description}
              </p>
              <h4 className="font-bold mb-2">Key Achievements:</h4>
              <ul className="space-y-2 mb-6">
                {experience[activeExp].achievements.map((achievement, aidx) => (
                  <li key={aidx} className="flex items-start">
                    <span className="text-accent-cyan mr-2">▸</span>
                    <span className="text-text-secondary">{achievement}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {experience[activeExp].technologies.map((tech, tidx) => (
                  <span
                    key={tidx}
                    className="px-3 py-1 bg-accent-lime/10 text-accent-lime text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Portfolio

