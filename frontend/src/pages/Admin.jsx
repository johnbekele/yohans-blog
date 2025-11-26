import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom'
import { getPosts, createPost, updatePost, deletePost, getPostBySlug } from '../services/postService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faEyeSlash,
  faSave,
  faArrowLeft,
  faMagic,
  faKey,
  faCog,
  faFileAlt,
} from '@fortawesome/free-solid-svg-icons'
import AIBlogGenerator from '../components/AIBlogGenerator'
import TokenManager from '../components/TokenManager'
import ChangePassword from '../components/ChangePassword'
import ProfileManagement from './ProfileManagement'
import PortfolioManagement from './PortfolioManagement'

const Admin = () => {
  return (
    <div className="min-h-screen bg-bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/create" element={<PostEditor />} />
          <Route path="/posts/edit/:slug" element={<PostEditor />} />
          <Route path="/portfolio" element={<PortfolioManagement />} />
          <Route path="/profile" element={<ProfileManagement />} />
          <Route path="/token" element={<TokenPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </div>
  )
}

const PostsPage = () => {
  const [activeTab, setActiveTab] = useState('manual') // 'manual' or 'ai'

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-accent-cyan">Posts</span> Management
        </h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-accent-cyan/20">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'manual'
                ? 'border-accent-cyan text-accent-cyan'
                : 'border-transparent text-text-secondary hover:text-accent-cyan'
            }`}
          >
            <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
            Manual Posts
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'ai'
                ? 'border-accent-cyan text-accent-cyan'
                : 'border-transparent text-text-secondary hover:text-accent-cyan'
            }`}
          >
            <FontAwesomeIcon icon={faMagic} className="mr-2" />
            AI Generator
          </button>
        </div>
      </div>

      {activeTab === 'manual' ? <PostsList /> : <AIGeneratorPage />}
    </>
  )
}

const AIGeneratorPage = () => {
  const [showTokenManager, setShowTokenManager] = useState(false)

  const handleTokenNeeded = () => {
    setShowTokenManager(true)
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">AI Blog Generator</h2>
            <p className="text-text-secondary mt-2">
              Generate professional blog posts instantly using AI
            </p>
          </div>
          <Link
            to="/admin/token"
            className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors font-medium flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faKey} />
            <span>Manage Token</span>
          </Link>
        </div>
      </div>

      {showTokenManager ? (
        <div className="mb-8">
          <TokenManager onTokenSaved={() => setShowTokenManager(false)} />
        </div>
      ) : (
        <AIBlogGenerator onTokenNeeded={handleTokenNeeded} />
      )}
    </>
  )
}

const TokenPage = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          <span className="text-accent-cyan">Token</span> Management
        </h1>
        <p className="text-text-secondary mt-2">
          Configure your Open Arena ESSO token for AI features
        </p>
      </div>

      <TokenManager />
    </>
  )
}

const SettingsPage = () => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          <span className="text-accent-cyan">Account</span> Settings
        </h1>
        <p className="text-text-secondary mt-2">
          Manage your account settings and security
        </p>
      </div>

      <div className="max-w-2xl">
        <ChangePassword />
      </div>
    </>
  )
}

const PostsList = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const data = await getPosts({ published_only: false, page_size: 50 })
      setPosts(data.posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      await deletePost(slug)
      setPosts(posts.filter((p) => p.slug !== slug))
    } catch (error) {
      alert('Error deleting post')
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-text-primary">All Posts</h2>
        <Link
          to="/admin/posts/create"
          className="px-6 py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          New Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="loading w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="card-elevated bg-bg-card rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-bg-secondary border-b border-professional">
                <tr>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm font-semibold">Views</th>
                  <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-t border-professional hover:bg-bg-secondary transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm">{post.title}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-xs rounded-full border border-accent-cyan/20">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      {post.published ? (
                        <span className="flex items-center text-green-400 text-sm">
                          <FontAwesomeIcon icon={faEye} className="mr-2" />
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center text-yellow-400 text-sm">
                          <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm">{post.views}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right space-x-2">
                      <Link
                        to={`/admin/posts/edit/${post.slug}`}
                        className="inline-flex px-3 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-all border border-accent-cyan/20 text-sm"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug)}
                        className="inline-flex px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/20 text-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

const PostEditor = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'general',
    tags: '',
    featured_image: '',
    images: '',  // Comma-separated image URLs
    published: false,
  })

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    try {
      const data = await getPostBySlug(slug)
      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        tags: data.tags.join(', '),
        featured_image: data.featured_image || '',
        images: data.images ? data.images.join(', ') : '',  // Convert array to comma-separated
        published: data.published,
      })
    } catch (error) {
      console.error('Error fetching post:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        images: formData.images.split(',').map((img) => img.trim()).filter(Boolean),  // Convert to array
      }

      if (slug) {
        await updatePost(slug, postData)
      } else {
        await createPost(postData)
      }

      navigate('/admin/posts')
    } catch (error) {
      alert('Error saving post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-8">
        <Link
          to="/admin/posts"
          className="inline-flex items-center text-accent-cyan hover:text-accent-lime transition-colors mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Posts
        </Link>
        <h1 className="text-4xl font-bold">
          {slug ? 'Edit' : 'Create'} <span className="text-accent-cyan">Post</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card-elevated bg-bg-card p-4 sm:p-6 lg:p-8 rounded-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              rows="3"
              className="w-full px-4 py-3 bg-bg-secondary border-inset rounded-lg focus:outline-none focus:border-accent-cyan/40 focus:ring-2 focus:ring-accent-cyan/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows="12"
              className="w-full px-4 py-3 bg-bg-secondary border-inset rounded-lg focus:outline-none focus:border-accent-cyan/40 focus:ring-2 focus:ring-accent-cyan/20 transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-bg-secondary border-inset rounded-lg focus:outline-none focus:border-accent-cyan/40 focus:ring-2 focus:ring-accent-cyan/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="devops, aws, python"
                className="w-full px-4 py-3 bg-bg-secondary border-inset rounded-lg focus:outline-none focus:border-accent-cyan/40 focus:ring-2 focus:ring-accent-cyan/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Featured Image URL</label>
            <input
              type="url"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-3 bg-bg-secondary border-inset rounded-lg focus:outline-none focus:border-accent-cyan/40 focus:ring-2 focus:ring-accent-cyan/20 transition-all"
            />
            <p className="text-xs text-text-secondary mt-1">Main cover image for the post</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Additional Images (comma-separated URLs)</label>
            <textarea
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://image1.jpg, https://image2.jpg, https://image3.jpg"
              rows="3"
              className="w-full px-4 py-3 bg-bg-secondary border-inset rounded-lg focus:outline-none focus:border-accent-cyan/40 focus:ring-2 focus:ring-accent-cyan/20 transition-all"
            />
            <p className="text-xs text-text-secondary mt-1">Multiple images for the post gallery (separated by commas)</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded border-accent-cyan/20 bg-bg-secondary"
            />
            <label htmlFor="published" className="ml-2">
              Publish immediately
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50"
          >
            {loading ? (
              <div className="loading w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full mx-auto"></div>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {slug ? 'Update' : 'Create'} Post
              </>
            )}
          </button>
        </div>
      </form>
    </>
  )
}

export default Admin

