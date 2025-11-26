import { useState } from 'react'
import { generateAndPostBlog } from '../services/aiService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagic, faSpinner, faCheck, faRocket } from '@fortawesome/free-solid-svg-icons'

const AIBlogGenerator = () => {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerate = async (e) => {
    e.preventDefault()
    
    if (!idea.trim()) {
      setError('Please enter an idea for your blog post')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await generateAndPostBlog(idea)
      setResult(response)
      setIdea('') // Clear the input
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate blog post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-bg-card p-8 rounded-lg border border-accent-cyan/20">
      <div className="flex items-center mb-6">
        <FontAwesomeIcon icon={faMagic} className="text-3xl text-accent-cyan mr-4" />
        <div>
          <h2 className="text-2xl font-bold">AI Blog Generator</h2>
          <p className="text-text-secondary text-sm">Powered by GPT</p>
        </div>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            What would you like to write about?
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: Write about the differences between REST and GraphQL APIs..."
            rows="4"
            className="w-full px-4 py-3 bg-bg-secondary border border-accent-cyan/20 rounded-lg focus:outline-none focus:border-accent-cyan resize-none"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !idea.trim()}
          className="w-full py-3 bg-accent-cyan text-bg-primary rounded-lg hover:bg-accent-lime transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faRocket} />
              <span>Generate & Publish Blog Post</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && result.success && (
        <div className="mt-4 p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faCheck} className="text-green-400 text-xl mt-1" />
            <div className="flex-1">
              <h3 className="font-bold text-green-400 mb-2">Blog Post Published!</h3>
              <p className="text-text-secondary mb-3">{result.message}</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-text-secondary">Title:</span> <span className="text-accent-cyan">{result.title}</span></p>
                <p><span className="text-text-secondary">Slug:</span> <span className="text-text-secondary">/blog/{result.slug}</span></p>
              </div>
              <a
                href={`/blog/${result.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-accent-lime/20 text-accent-lime rounded-lg hover:bg-accent-lime/30 transition-colors text-sm"
              >
                View Blog Post →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIBlogGenerator

