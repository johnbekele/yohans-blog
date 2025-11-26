import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPosts, getAllTags, getAllCategories } from '../services/postService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSearch,
  faTag,
  faFolder,
  faClock,
  faEye,
} from '@fortawesome/free-solid-svg-icons'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [tags, setTags] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    fetchPosts()
    fetchFilters()
  }, [currentPage, selectedCategory, selectedTag, searchQuery])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage,
        page_size: 9,
      }
      if (selectedCategory) params.category = selectedCategory
      if (selectedTag) params.tag = selectedTag
      if (searchQuery) params.search = searchQuery

      const data = await getPosts(params)
      setPosts(data.posts)
      setTotalPages(data.total_pages)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const [tagsData, categoriesData] = await Promise.all([
        getAllTags(),
        getAllCategories(),
      ])
      setTags(tagsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchPosts()
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
    setCurrentPage(1)
  }

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? '' : tag)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent-cyan">Technical</span> Blog
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Insights on DevOps, Cloud Infrastructure, LLM technologies, and
            full-stack development
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full px-6 py-4 pl-12 bg-bg-card border-inset rounded-lg focus:outline-none focus:border-accent-cyan/40 focus:ring-2 focus:ring-accent-cyan/20 transition-all"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="card-elevated bg-bg-card p-6 rounded-lg sticky top-24">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center pb-3 border-b border-professional">
                  <FontAwesomeIcon
                    icon={faFolder}
                    className="text-accent-cyan mr-2"
                  />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium ${
                        selectedCategory === category
                          ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 shadow-sm'
                          : 'bg-bg-secondary/50 hover:bg-bg-secondary text-text-secondary hover:text-text-primary border border-transparent'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center pb-3 border-b border-professional">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="text-accent-lime mr-2"
                  />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedTag === tag
                          ? 'bg-accent-lime/10 text-accent-lime border border-accent-lime/30 shadow-sm'
                          : 'bg-bg-secondary/50 hover:bg-bg-secondary text-text-secondary hover:text-text-primary border border-transparent'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Posts Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loading w-12 h-12 border-4 border-accent-cyan border-t-transparent rounded-full"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-xl">
                  No posts found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {posts.map((post) => (
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
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="px-3 py-1 bg-accent-cyan/10 text-accent-cyan text-sm rounded-full">
                            {post.category}
                          </span>
                          <span className="text-text-secondary text-sm flex items-center">
                            <FontAwesomeIcon icon={faClock} className="mr-1" />
                            {post.read_time} min
                          </span>
                          <span className="text-text-secondary text-sm flex items-center">
                            <FontAwesomeIcon icon={faEye} className="mr-1" />
                            {post.views}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-text-secondary mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-text-secondary">
                            by {post.author}
                          </span>
                          <span className="text-accent-lime group-hover:translate-x-2 transition-transform">
                            →
                          </span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-accent-lime/10 text-accent-lime text-xs rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-bg-card rounded-lg hover:bg-bg-secondary border border-professional transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                            currentPage === page
                              ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 shadow-sm'
                              : 'bg-bg-card hover:bg-bg-secondary border border-professional'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-bg-card rounded-lg hover:bg-bg-secondary border border-professional transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog

