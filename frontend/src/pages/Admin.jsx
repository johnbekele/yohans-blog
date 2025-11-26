import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { getPosts, createPost, updatePost, deletePost } from '../services/postService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faEyeSlash,
  faSave,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

const Admin = () => {
  return (
    <div className="min-h-screen bg-bg-primary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<PostsList />} />
          <Route path="/create" element={<PostEditor />} />
          <Route path="/edit/:slug" element={<PostEditor />} />
        </Routes>
      </div>
    </div>
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
        <h1 className="text-4xl font-bold">
          <span className="text-accent-cyan">Admin</span> Dashboard
        </h1>
        <Link
          to="/admin/create"
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
        <div className="bg-bg-card rounded-lg border border-accent-cyan/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-secondary">
              <tr>
                <th className="px-6 py-4 text-left">Title</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post._id}
                  className="border-t border-accent-cyan/10 hover:bg-bg-secondary transition-colors"
                >
                  <td className="px-6 py-4">{post.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-sm rounded-full">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {post.published ? (
                      <span className="flex items-center text-green-400">
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Published
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-400">
                        <FontAwesomeIcon icon={faEyeSlash} className="mr-2" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">{post.views}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/admin/edit/${post.slug}`}
                      className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.slug)}
                      className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      }

      if (slug) {
        await updatePost(slug, postData)
      } else {
        await createPost(postData)
      }

      navigate('/admin')
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
          to="/admin"
          className="inline-flex items-center text-accent-cyan hover:text-accent-lime transition-colors mb-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold">
          {slug ? 'Edit' : 'Create'} <span className="text-accent-cyan">Post</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-bg-card p-8 rounded-lg border border-accent-cyan/20">
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
              className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows="12"
              className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="devops, aws, python"
                className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan"
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
              className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan"
            />
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

// Missing import
import { useParams } from 'react-router-dom'
import { getPostBySlug } from '../services/postService'

export default Admin

