import React from 'react'
import { logError } from '../utils/errorHandler'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error in development only
    logError('ErrorBoundary', error)
    
    this.setState({
      error,
      errorInfo
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
          <div className="max-w-md w-full text-center">
            <div className="card-elevated bg-bg-card p-8 rounded-lg">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold mb-4 text-accent-cyan">
                Oops! Something went wrong
              </h1>
              <p className="text-text-secondary mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page or go back to the homepage.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left overflow-auto max-h-40">
                  <p className="text-xs text-red-400 font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReload}
                  className="px-6 py-3 bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 rounded-lg hover:bg-accent-cyan/20 transition-all font-medium"
                >
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="px-6 py-3 bg-bg-secondary border border-professional rounded-lg hover:bg-bg-primary transition-all font-medium"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

