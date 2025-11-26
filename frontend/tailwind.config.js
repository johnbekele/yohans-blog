/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-cyan': '#00d9ff',
        'accent-lime': '#ccff00',
        'accent-cyan-dim': 'rgba(0, 217, 255, 0.1)',
        'accent-lime-dim': 'rgba(204, 255, 0, 0.1)',
        'bg-primary': '#0a0e1a',
        'bg-secondary': '#151925',
        'bg-card': '#1a1f2e',
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

