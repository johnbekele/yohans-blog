import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getPosts } from '../services/postService'
import { getPersonalInfo } from '../services/portfolioService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCode, faRocket, faBlog } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [personalInfo, setPersonalInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, infoData] = await Promise.all([
          getPosts({ page: 1, page_size: 3 }),
          getPersonalInfo(),
        ])
        setFeaturedPosts(postsData.posts)
        setPersonalInfo(infoData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-bg-secondary to-bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-accent-cyan">Code</span>,{' '}
              <span className="text-accent-lime">Create</span> &{' '}
              <span className="text-text-primary">Share</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
              Welcome to my technical blog where I share insights on DevOps,
              Cloud Infrastructure, LLM technologies, and full-stack development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/blog"
                className="px-8 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium inline-flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faBlog} className="mr-2" />
                Read Blog
                <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
              </Link>
              <Link
                to="/portfolio"
                className="px-8 py-3 bg-transparent border-2 border-accent-cyan text-accent-cyan rounded-lg hover:bg-accent-cyan/10 transition-colors font-medium inline-flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faCode} className="mr-2" />
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-accent-cyan">Latest</span> Posts
            </h2>
            <Link
              to="/blog"
              className="text-accent-lime hover:text-accent-cyan transition-colors flex items-center"
            >
              View All
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Link
                key={post._id}
                to={`/blog/${post.slug}`}
                className="card-elevated bg-bg-card rounded-lg overflow-hidden group"
              >
                {post.featured_image && (
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-sm rounded-full">
                      {post.category}
                    </span>
                    <span className="text-text-secondary text-sm">
                      {post.read_time} min read
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-text-secondary mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">
                      by {post.author}
                    </span>
                    <span className="text-accent-lime group-hover:translate-x-2 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      {personalInfo && (
        <section className="py-20 bg-bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  <span className="text-accent-lime">About</span> Me
                </h2>
                <p className="text-text-secondary text-lg mb-6">
                  {personalInfo.bio}
                </p>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center px-6 py-3 bg-accent-lime text-bg-primary rounded-lg hover:bg-accent-cyan transition-colors font-medium"
                >
                  <FontAwesomeIcon icon={faRocket} className="mr-2" />
                  Explore My Work
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="card-elevated bg-bg-card p-6 rounded-lg">
                  <FontAwesomeIcon
                    icon={faCode}
                    className="text-4xl text-accent-cyan mb-4"
                  />
                  <h3 className="text-2xl font-bold mb-2">5+</h3>
                  <p className="text-text-secondary">Years Experience</p>
                </div>
                <div className="card-elevated bg-bg-card p-6 rounded-lg">
                  <FontAwesomeIcon
                    icon={faRocket}
                    className="text-4xl text-accent-lime mb-4"
                  />
                  <h3 className="text-2xl font-bold mb-2">10+</h3>
                  <p className="text-text-secondary">Projects Deployed</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home

