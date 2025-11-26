const Divider = ({ type = 'gradient', className = '' }) => {
  const types = {
    gradient: 'divider-gradient',
    section: 'divider-section',
    simple: 'border-t border-accent-cyan/20',
  }
  
  return <div className={`${types[type]} ${className}`}></div>
}

export default Divider

