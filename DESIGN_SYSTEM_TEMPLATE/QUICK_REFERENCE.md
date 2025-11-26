# Quick Reference Guide

## 🎨 Color Palette

### Dark Mode
- **Accent Cyan**: `#94a3b8` - Primary accent color
- **Accent Lime**: `#cbd5e1` - Secondary accent color
- **Background Primary**: `#0f172a` - Main background
- **Background Secondary**: `#1e293b` - Card/component background
- **Text Primary**: `#f1f5f9` - Main text
- **Text Secondary**: `#94a3b8` - Secondary text

### Light Mode
- **Accent Cyan**: `#64748b`
- **Accent Lime**: `#475569`
- **Background Primary**: `#ffffff`
- **Background Secondary**: `#f8fafc`
- **Text Primary**: `#0f172a`
- **Text Secondary**: `#64748b`

## 🧩 Component Usage

### Navbar
```jsx
<Navbar 
  logo="Your Logo" 
  navItems={[
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' }
  ]} 
/>
```

### Card
```jsx
<Card hover={true}>
  <h2 className="text-2xl font-bold text-text-primary">Title</h2>
  <p className="text-text-secondary">Content</p>
</Card>
```

### Button
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Divider
```jsx
<Divider type="section" />  // Full section divider
<Divider type="gradient" />  // Simple gradient line
<Divider type="simple" />    // Simple border
```

## 🎯 Common Patterns

### Link Styling
```jsx
<Link className="text-text-secondary hover:text-accent-cyan transition-colors">
  Link Text
</Link>
```

### Section with Title
```jsx
<section className="py-12">
  <h2 className="text-3xl font-bold text-text-primary mb-6">Section Title</h2>
  <Divider type="section" />
  {/* Content */}
</section>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</div>
```

### Button Group
```jsx
<div className="flex gap-4">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
</div>
```

## 🎨 Tailwind Classes

### Backgrounds
- `bg-primary` - Main background
- `bg-secondary` - Card/component background
- `bg-card` - Card background
- `bg-accent-cyan/10` - Cyan with 10% opacity
- `bg-accent-lime/10` - Lime with 10% opacity

### Text Colors
- `text-primary` - Main text
- `text-secondary` - Secondary text
- `text-accent-cyan` - Cyan accent
- `text-accent-lime` - Lime accent

### Borders
- `border-professional` - Professional border class
- `border-accent-cyan` - Cyan border
- `border-accent-lime` - Lime border

### Utilities
- `card-elevated` - Card with hover effect
- `divider-gradient` - Gradient divider
- `divider-section` - Section divider
- `fade-in` - Fade in animation
- `loading` - Spinning loader

## 🔧 Theme Context

```jsx
import { useTheme } from './context/ThemeContext'

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}
```

## 📱 Responsive Breakpoints

- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

## 🎭 Animations

All components include smooth transitions:
- Colors: `transition-colors`
- All: `transition-all`
- Transform: `transition-transform`

## 💡 Tips

1. Always use CSS variables for colors
2. Test components in both dark and light mode
3. Use semantic HTML with proper accessibility
4. Follow the existing component patterns
5. Keep spacing consistent (use Tailwind spacing scale)

