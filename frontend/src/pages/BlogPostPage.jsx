import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPostBySlug } from '../services/postService'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faClock,
  faEye,
  faTag,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons'

const BlogPostPage = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const data = await getPostBySlug(slug)
      setPost(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Post not found')
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

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">
            Post Not Found
          </h1>
          <Link
            to="/blog"
            className="text-accent-cyan hover:text-accent-lime transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-accent-cyan hover:text-accent-lime transition-colors mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Back to Blog
        </Link>

        {/* Post Header */}
        <article className="bg-bg-card rounded-lg p-8 border border-accent-cyan/20">
          <div className="mb-6">
            <span className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-full text-sm">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-6 pb-6 border-b border-accent-cyan/20">
            <span>by {post.author}</span>
            <span className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              {post.read_time} min read
            </span>
            <span className="flex items-center">
              <FontAwesomeIcon icon={faEye} className="mr-2" />
              {post.views} views
            </span>
          </div>

          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          )}

          {/* Post Content */}
          <div className="prose prose-invert prose-cyan max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-accent-cyan/20">
              <div className="flex items-center gap-2 flex-wrap">
                <FontAwesomeIcon
                  icon={faTag}
                  className="text-accent-lime mr-2"
                />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent-lime/10 text-accent-lime rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

export default BlogPostPage

