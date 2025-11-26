# Design System Template

A reusable design system template extracted from the blog portfolio project. Use this in any React + Tailwind CSS project.

## 🚀 Quick Start

### 1. Copy Files to Your Project

Copy these files/folders to your new project:

```
DESIGN_SYSTEM_TEMPLATE/
├── index.css              → src/index.css
├── tailwind.config.js     → tailwind.config.js
└── src/
    ├── context/
    │   └── ThemeContext.jsx
    └── components/
        ├── Navbar.jsx
        ├── Card.jsx
        ├── Button.jsx
        └── Divider.jsx
```

### 2. Install Dependencies

```bash
npm install tailwindcss postcss autoprefixer daisyui
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
```

### 3. Setup Tailwind

```bash
npx tailwindcss init -p
```

Replace the generated `tailwind.config.js` with the template version.

### 4. Import CSS

In your `main.jsx` or `App.jsx`:

```jsx
import './index.css'
```

### 5. Setup Theme Provider

Wrap your app with `ThemeProvider`:

```jsx
// App.jsx
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'

function App() {
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <ThemeProvider>
      <Navbar logo="Your Logo" navItems={navItems} />
      {/* Your app content */}
    </ThemeProvider>
  )
}
```

## 🎨 Usage Examples

### Card Component

```jsx
import Card from './components/Card'

<Card>
  <h2 className="text-2xl font-bold text-text-primary mb-4">Card Title</h2>
  <p className="text-text-secondary">Card content goes here</p>
</Card>
```

### Button Component

```jsx
import Button from './components/Button'

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

<Button variant="secondary" size="lg">
  Secondary Button
</Button>
```

### Divider Component

```jsx
import Divider from './components/Divider'

<Divider type="section" />
<Divider type="gradient" />
<Divider type="simple" />
```

### Using Theme

```jsx
import { useTheme } from './context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme()
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  )
}
```

## 🎨 Color Classes

Use these Tailwind classes throughout your project:

- `bg-primary`, `bg-secondary`, `bg-card`
- `text-primary`, `text-secondary`
- `text-accent-cyan`, `text-accent-lime`
- `bg-accent-cyan/10`, `bg-accent-lime/10` (with opacity)
- `border-accent-cyan`, `border-accent-lime`

## 📐 Utility Classes

- `.border-professional` - Professional border with shadow
- `.card-elevated` - Card with hover elevation effect
- `.divider-gradient` - Horizontal gradient line
- `.divider-section` - Section separator
- `.fade-in` - Fade in animation
- `.loading` - Spinning loader

## 🔧 Customization

### Change Colors

Edit CSS variables in `index.css`:

```css
:root,
[data-theme="dark"] {
  --accent-cyan: #your-color;
  --accent-lime: #your-color;
  /* ... */
}
```

### Change Logo

Pass a custom logo to Navbar:

```jsx
<Navbar logo="My App" navItems={navItems} />
```

### Add Custom Components

Follow the pattern of existing components:
- Use CSS variables for colors
- Support dark/light mode
- Use Tailwind utility classes
- Include hover states and transitions

## 📱 Responsive Design

All components are mobile-first and responsive:
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

## 🎯 Best Practices

1. **Always use CSS variables** for colors (not hardcoded hex values)
2. **Use theme context** for theme-dependent logic
3. **Follow component patterns** for consistency
4. **Test in both themes** (dark and light mode)
5. **Use semantic HTML** with proper accessibility attributes

## 📚 Full Documentation

See `DESIGN_SYSTEM.md` in the parent directory for complete documentation.

