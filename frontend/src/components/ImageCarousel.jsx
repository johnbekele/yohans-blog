import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const ImageCarousel = ({ images, autoSwipeInterval = 5000, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [failedImages, setFailedImages] = useState(new Set())
  const intervalRef = useRef(null)

  // Filter out failed images
  const validImages = images ? images.filter((img, idx) => {
    if (!img || typeof img !== 'string' || img.trim() === '') return false
    return !failedImages.has(idx)
  }) : []

  // Reset current index if it's out of bounds
  useEffect(() => {
    if (currentIndex >= validImages.length && validImages.length > 0) {
      setCurrentIndex(0)
    }
  }, [validImages.length, currentIndex])

  // Auto-swipe functionality
  useEffect(() => {
    if (!validImages || validImages.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length)
    }, autoSwipeInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [validImages.length, autoSwipeInterval, isPaused])

  const goToPrevious = () => {
    setIsPaused(true)
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1))
    // Resume auto-swipe after 3 seconds
    setTimeout(() => setIsPaused(false), 3000)
  }

  const goToNext = () => {
    setIsPaused(true)
    setCurrentIndex((prev) => (prev + 1) % validImages.length)
    // Resume auto-swipe after 3 seconds
    setTimeout(() => setIsPaused(false), 3000)
  }

  const goToSlide = (index) => {
    if (index < 0 || index >= validImages.length) return
    setIsPaused(true)
    setCurrentIndex(index)
    // Resume auto-swipe after 3 seconds
    setTimeout(() => setIsPaused(false), 3000)
  }

  // Create SVG placeholder
  const createPlaceholder = () => {
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="400">
        <rect fill="#334155" width="800" height="400"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              fill="#94a3b8" font-family="Arial" font-size="18">Image Not Found</text>
      </svg>
    `)}`
  }

  if (!images || images.length === 0 || validImages.length === 0) {
    return (
      <div className={`w-full h-48 sm:h-56 bg-bg-secondary rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-text-secondary text-sm">No images</p>
      </div>
    )
  }

  if (validImages.length === 1) {
    return (
      <div className={`relative w-full h-48 sm:h-56 overflow-hidden rounded-lg ${className}`}>
        <img
          src={validImages[0]}
          alt="Project"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = createPlaceholder()
          }}
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className={`relative w-full h-48 sm:h-56 overflow-hidden rounded-lg group ${className}`}>
      {/* Images */}
      <div className="relative w-full h-full">
        {validImages.map((image, index) => {
          const originalIndex = images.indexOf(image)
          const isFailed = failedImages.has(originalIndex)
          
          if (isFailed) return null
          
          return (
            <div
              key={`${originalIndex}-${index}`}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Mark this image as failed
                  setFailedImages(prev => {
                    const newSet = new Set([...prev, originalIndex])
                    // If current image failed, move to next valid image
                    if (index === currentIndex && validImages.length > 1) {
                      const nextIndex = (index + 1) % validImages.length
                      if (nextIndex !== index) {
                        setTimeout(() => setCurrentIndex(nextIndex), 100)
                      }
                    }
                    return newSet
                  })
                  e.target.style.display = 'none'
                }}
                onLoad={(e) => {
                  // Image loaded successfully, ensure it's visible
                  e.target.style.display = 'block'
                }}
                loading="lazy"
              />
            </div>
          )
        })}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 active:bg-black/90 text-white p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-10 shadow-lg hover:scale-110 active:scale-95"
        aria-label="Previous image"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="text-base sm:text-lg" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 active:bg-black/90 text-white p-2 sm:p-3 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-10 shadow-lg hover:scale-110 active:scale-95"
        aria-label="Next image"
      >
        <FontAwesomeIcon icon={faChevronRight} className="text-base sm:text-lg" />
      </button>

      {/* Dots Indicator */}
      {validImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-10 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75 w-2 active:bg-white/90'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {validImages.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm z-10 font-medium">
          {currentIndex + 1} / {validImages.length}
        </div>
      )}
    </div>
  )
}

export default ImageCarousel
