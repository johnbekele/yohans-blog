# Design System - Reusable Package

This design system can be used in any React + Tailwind CSS project. It provides a consistent, professional look with dark/light mode support.

## 🎨 Color Palette

### CSS Variables (in `index.css`)

```css
/* Dark Mode (Default) */
:root,
[data-theme="dark"] {
  --accent-cyan: #94a3b8;
  --accent-lime: #cbd5e1;
  --accent-cyan-dim: rgba(148, 163, 184, 0.1);
  --accent-lime-dim: rgba(203, 213, 225, 0.1);
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-card: #334155;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
}

/* Light Mode */
[data-theme="light"] {
  --accent-cyan: #64748b;
  --accent-lime: #475569;
  --accent-cyan-dim: rgba(100, 116, 139, 0.1);
  --accent-lime-dim: rgba(71, 85, 105, 0.1);
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --bg-card: #f1f5f9;
  --text-primary: #0f172a;
  --text-secondary: #64748b;
}
```

### Tailwind Config

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'accent-cyan': 'var(--accent-cyan)',
        'accent-lime': 'var(--accent-lime)',
        'accent-cyan-dim': 'var(--accent-cyan-dim)',
        'accent-lime-dim': 'var(--accent-lime-dim)',
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-card': 'var(--bg-card)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
      },
      fontFamily: {
        'code': ['Fira Code', 'monospace'],
      },
    },
  },
}
```

## 📐 Typography

- **Font Family**: System fonts (San Francisco, Segoe UI, Roboto)
- **Code Font**: Fira Code (monospace)
- **Base Size**: 16px
- **Line Height**: Relaxed (1.6-1.8)

## 🎯 Component Patterns

### Navbar Component

**Key Features:**
- Sticky top navigation
- Responsive mobile menu
- Theme toggle button
- Professional border styling
- Backdrop blur effect

**Structure:**
```jsx
<nav className="bg-bg-secondary border-b border-professional sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
  {/* Logo */}
  {/* Desktop Navigation */}
  {/* Mobile Menu Button */}
  {/* Mobile Navigation */}
</nav>
```

### Professional Borders

**Classes:**
- `.border-professional` - Subtle border with shadow
- `.divider-gradient` - Horizontal gradient line
- `.divider-section` - Section separator with gradient
- `.card-elevated` - Card with elevated border and hover effect
- `.border-inset` - Inset border with shadow

### Button Styles

**Primary Button:**
```jsx
<button className="px-4 py-2 bg-accent-cyan/10 text-accent-cyan rounded-lg hover:bg-accent-cyan/20 transition-colors">
  Button Text
</button>
```

**Secondary Button:**
```jsx
<button className="px-4 py-2 bg-accent-lime/10 text-accent-lime rounded-lg hover:bg-accent-lime/20 transition-colors">
  Button Text
</button>
```

**Icon Button:**
```jsx
<button className="p-2 rounded-lg hover:bg-accent-cyan/10 transition-colors">
  <Icon />
</button>
```

## 🎭 Animations

### Loading Spinner
```css
.loading {
  animation: spin 1s linear infinite;
}
```

### Fade In
```css
.fade-in {
  animation: fadeIn 0.6s ease-out;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install tailwindcss postcss autoprefixer daisyui
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

### 2. Copy Files

Copy these files to your project:
- `index.css` - All CSS variables and utility classes
- `tailwind.config.js` - Tailwind configuration
- `Navbar.jsx` - Navbar component (adapt as needed)
- `ThemeContext.jsx` - Theme management context

### 3. Theme Context Setup

Create a `ThemeContext` to manage dark/light mode:

```jsx
// context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

### 4. Apply to Your App

```jsx
// App.jsx
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  )
}
```

## 🎨 Usage Examples

### Card Component
```jsx
<div className="bg-bg-secondary border border-professional rounded-lg p-6 card-elevated">
  <h2 className="text-2xl font-bold text-text-primary mb-4">Card Title</h2>
  <p className="text-text-secondary">Card content</p>
</div>
```

### Section with Divider
```jsx
<section>
  <h2 className="text-3xl font-bold text-text-primary mb-6">Section Title</h2>
  <div className="divider-section"></div>
  <p className="text-text-secondary">Section content</p>
</section>
```

### Link Styling
```jsx
<Link className="text-text-secondary hover:text-accent-cyan transition-colors">
  Link Text
</Link>
```

## 🚀 Quick Start Template

See `DESIGN_SYSTEM_TEMPLATE/` folder for a complete template you can copy to new projects.

