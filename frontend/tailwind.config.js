/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        glowDiff: {
          '0%, 100%': { borderColor: 'inherit', backgroundColor: 'transparent' },
          '50%': { borderColor: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.15)' }
        }
      },
      animation: {
        'glow-diff': 'glowDiff 1.5s ease-in-out infinite alternate',
      }
    },
  },
  plugins: [],
}
