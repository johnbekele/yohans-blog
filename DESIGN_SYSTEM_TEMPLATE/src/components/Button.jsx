const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false
}) => {
  const baseClasses = "rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20",
    secondary: "bg-accent-lime/10 text-accent-lime hover:bg-accent-lime/20",
    outline: "border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10",
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

export default Button

