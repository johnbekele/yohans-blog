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
    <div className="min-h-screen bg-bg-primary py-8">
      {/* Centered narrow layout with more breathing room */}
      <div className="relative mx-auto w-[96%] pb-20 md:w-[90%] lg:w-[65%] xl:w-[60%] 2xl:w-[55%] px-4">
        {/* Sticky Header with more space */}
        <div className="sticky top-0 mb-8 bg-bg-primary/95 backdrop-blur-sm z-10 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center text-accent-cyan hover:text-accent-lime transition-colors text-sm font-medium"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* Title Section - More Spacious */}
        <header className="mb-12">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-full text-sm font-medium">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary leading-tight mb-6">
            {post.title}
          </h1>

          {/* Metadata - Better Spacing */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-accent-cyan/10">
            <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">by {post.author}</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {post.read_time} min read
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center">
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                {post.views} views
              </span>
            </div>
            <div className="text-sm italic text-text-secondary">
              {new Date(post.created_at).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Featured Image - More Spacing */}
        {post.featured_image && (
          <div className="mb-12">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto rounded-xl shadow-xl"
            />
          </div>
        )}

        {/* Blog Content - More Breathing Room */}
        <article className="prose prose-base md:prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-text-primary
          prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-12 prose-h1:leading-tight
          prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-10 prose-h2:text-accent-cyan prose-h2:leading-tight
          prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-3 prose-h3:mt-8 prose-h3:leading-tight
          prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6 prose-p:text-text-secondary prose-p:font-normal
          prose-a:text-accent-cyan prose-a:no-underline prose-a:font-medium hover:prose-a:text-accent-lime hover:prose-a:underline
          prose-strong:text-text-primary prose-strong:font-bold
          prose-code:text-orange-400 prose-code:bg-bg-secondary prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
          prose-pre:bg-bg-secondary prose-pre:border prose-pre:border-accent-cyan/20 prose-pre:rounded-xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:my-8
          prose-blockquote:border-l-4 prose-blockquote:border-accent-cyan prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-text-secondary prose-blockquote:my-8 prose-blockquote:py-2
          prose-ul:list-disc prose-ul:pl-8 prose-ul:mb-6 prose-ul:text-text-secondary prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-8 prose-ol:mb-6 prose-ol:text-text-secondary prose-ol:space-y-2
          prose-li:mb-3 prose-li:text-text-secondary prose-li:leading-relaxed
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10 prose-img:py-0
          prose-hr:border-accent-cyan/20 prose-hr:my-10
          dark:text-text-primary dark:prose-headings:text-text-primary dark:prose-a:text-accent-cyan dark:prose-blockquote:text-text-secondary dark:prose-strong:text-text-primary dark:prose-code:bg-bg-secondary dark:prose-code:text-orange-400 dark:prose-pre:bg-bg-secondary dark:prose-ol:text-text-secondary dark:prose-ul:text-text-secondary dark:prose-li:text-text-secondary
        ">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      borderRadius: '0.75rem',
                      padding: '1.5rem',
                      fontSize: '0.875rem',
                      backgroundColor: 'var(--bg-secondary)',
                      marginTop: '2rem',
                      marginBottom: '2rem',
                    }}
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
        </article>

        {/* Additional Images Gallery - More Spacing */}
        {post.images && post.images.length > 0 && (
          <div className="mt-16 mb-12">
            <h3 className="text-2xl font-bold mb-8 text-accent-cyan">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src={image}
                    alt={`${post.title} - Image ${index + 1}`}
                    className="w-full h-auto hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => window.open(image, '_blank')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags Section - Better Spacing */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-accent-cyan/20">
            <div className="flex items-center gap-3 flex-wrap">
              <FontAwesomeIcon
                icon={faTag}
                className="text-accent-lime text-lg"
              />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-accent-lime/10 text-accent-lime rounded-full text-sm font-medium hover:bg-accent-lime/20 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostPage

