import { useState, useEffect } from 'react'
import { generateAndPostBlog } from '../services/aiService'
import { getTokenStatus } from '../services/tokenService'
import { logError, getErrorMessage } from '../utils/errorHandler'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagic, faSpinner, faCheck, faRocket, faExclamationTriangle, faKey, faBrain } from '@fortawesome/free-solid-svg-icons'

const AIBlogGenerator = ({ onTokenNeeded }) => {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [tokenStatus, setTokenStatus] = useState(null)
  const [checkingToken, setCheckingToken] = useState(true)
  const [selectedModel, setSelectedModel] = useState('gemini') // Default to Gemini

  useEffect(() => {
    checkTokenStatus()
  }, [])

  const checkTokenStatus = async () => {
    setCheckingToken(true)
    try {
      const status = await getTokenStatus()
      setTokenStatus(status)
    } catch (err) {
      logError('AIBlogGenerator.checkTokenStatus', err)
      setError('Failed to check token status. Please refresh the page.')
    } finally {
      setCheckingToken(false)
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    
    if (!idea.trim()) {
      setError('Please enter an idea for your blog post')
      return
    }

    // Check token status only for GPT model
    if (selectedModel === 'gpt' && (!tokenStatus?.has_token || !tokenStatus?.token_valid)) {
      setError('Please configure a valid Open Arena token first to use GPT model')
      if (onTokenNeeded) {
        onTokenNeeded()
      }
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('🔵 DEBUG: Sending request with model:', selectedModel, 'idea:', idea)
      const response = await generateAndPostBlog(idea, selectedModel)
      console.log('🟢 DEBUG: Received response:', response)
      console.log('🟢 DEBUG: Response type:', typeof response)
      console.log('🟢 DEBUG: Response keys:', Object.keys(response))
      setResult(response)
      setIdea('') // Clear the input
    } catch (err) {
      const errorMsg = getErrorMessage(err)
      setError(errorMsg)
      logError('AIBlogGenerator.handleGenerate', err)
      
      // If token error on GPT, refresh token status
      if (selectedModel === 'gpt' && (errorMsg.toLowerCase().includes('token') || errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('invalid'))) {
        checkTokenStatus()
        if (onTokenNeeded) {
          onTokenNeeded()
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-elevated bg-bg-card p-6 sm:p-8 rounded-lg">
      <div className="flex items-center mb-6">
        <FontAwesomeIcon icon={faMagic} className="text-3xl text-accent-cyan mr-4" />
        <div>
          <h2 className="text-2xl font-bold">AI Blog Generator</h2>
          <p className="text-text-secondary text-sm">Powered by GPT or Gemini</p>
        </div>
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3 text-text-primary">
          Choose AI Model
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedModel('gemini')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedModel === 'gemini'
                ? 'border-accent-cyan bg-accent-cyan/10'
                : 'border-professional hover:border-accent-cyan/50'
            }`}
          >
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faBrain} className={`text-xl mr-2 ${selectedModel === 'gemini' ? 'text-accent-cyan' : 'text-text-secondary'}`} />
              <span className="font-bold">Google Gemini 2.0 Flash</span>
            </div>
            <p className="text-xs text-text-secondary">Fast & powerful • No token required</p>
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedModel('gpt')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedModel === 'gpt'
                ? 'border-accent-lime bg-accent-lime/10'
                : 'border-professional hover:border-accent-lime/50'
            }`}
          >
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faMagic} className={`text-xl mr-2 ${selectedModel === 'gpt' ? 'text-accent-lime' : 'text-text-secondary'}`} />
              <span className="font-bold">GPT-4 Turbo</span>
            </div>
            <p className="text-xs text-text-secondary">Advanced reasoning • Token required</p>
          </button>
        </div>
      </div>

      {/* Token Status Warning - Only for GPT */}
      {selectedModel === 'gpt' && !checkingToken && (!tokenStatus?.has_token || !tokenStatus?.token_valid) && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-400 text-xl mt-1" />
            <div className="flex-1">
              <p className="font-medium text-yellow-400 mb-1">GPT Token Required</p>
              <p className="text-text-secondary text-sm mb-3">
                {tokenStatus?.has_token 
                  ? 'Your Open Arena token has expired. Please update it to use GPT model.'
                  : 'Please configure your Open Arena ESSO token to use GPT-4 Turbo.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {onTokenNeeded && (
                  <button
                    onClick={onTokenNeeded}
                    className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors text-sm flex items-center space-x-2 border border-accent-cyan/20"
                  >
                    <FontAwesomeIcon icon={faKey} />
                    <span>Configure Token</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedModel('gemini')}
                  className="px-4 py-2 bg-accent-lime/10 text-accent-lime rounded-lg hover:bg-accent-lime/20 transition-colors text-sm border border-accent-lime/20"
                >
                  Switch to Gemini (No Token Needed)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gemini Info */}
      {selectedModel === 'gemini' && (
        <div className="mb-6 p-4 bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <FontAwesomeIcon icon={faBrain} className="text-accent-cyan text-xl mt-1" />
            <div>
              <p className="font-medium text-accent-cyan mb-1">Using Gemini 2.0 Flash</p>
              <p className="text-text-secondary text-sm">
                No token configuration required! Just enter your idea and generate.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-text-primary">
            What would you like to write about?
          </label>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Example: Write about the differences between REST and GraphQL APIs..."
            rows="4"
            className="w-full px-4 py-3 bg-bg-secondary border-inset rounded-lg focus:outline-none focus:border-accent-cyan/40 focus:ring-2 focus:ring-accent-cyan/20 transition-all resize-none"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !idea.trim() || (selectedModel === 'gpt' && (!tokenStatus?.has_token || !tokenStatus?.token_valid))}
          className="w-full py-3 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 rounded-lg hover:bg-accent-cyan/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
              <span>Generating with {selectedModel === 'gemini' ? 'Gemini' : 'GPT'}...</span>
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faRocket} />
              <span>Generate & Publish with {selectedModel === 'gemini' ? 'Gemini' : 'GPT'}</span>
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
                {result.model && (
                  <p><span className="text-text-secondary">Model:</span> <span className="text-accent-lime">{result.model.toUpperCase()}</span></p>
                )}
              </div>
              <a
                href={`/blog/${result.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-accent-lime/20 text-accent-lime rounded-lg hover:bg-accent-lime/30 transition-colors text-sm border border-accent-lime/20"
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

