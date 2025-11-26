/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["dark", "light"],
    darkTheme: "dark",
  },
}

