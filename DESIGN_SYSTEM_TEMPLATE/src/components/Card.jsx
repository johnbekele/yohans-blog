const Card = ({ children, className = "", hover = true }) => {
  return (
    <div className={`bg-bg-secondary border border-professional rounded-lg p-6 ${hover ? 'card-elevated' : ''} ${className}`}>
      {children}
    </div>
  )
}

export default Card

