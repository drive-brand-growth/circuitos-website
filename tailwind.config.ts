import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark Knight Batman Theme
        batman: {
          black: '#0a0a0a',
          dark: '#121212',
          charcoal: '#1a1a1a',
          steel: '#2a2a2a',
          gray: '#3a3a3a',
          silver: '#888888',
          gold: '#c9a227',
          'gold-light': '#e6c547',
          'gold-dark': '#a68520',
          blue: '#1e3a5f',
          'blue-light': '#2d4a6f',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'batman-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'gold-gradient': 'linear-gradient(135deg, #a68520 0%, #c9a227 50%, #e6c547 100%)',
      },
      boxShadow: {
        'batman': '0 0 40px rgba(201, 162, 39, 0.1)',
        'batman-lg': '0 0 60px rgba(201, 162, 39, 0.15)',
        'inner-gold': 'inset 0 0 20px rgba(201, 162, 39, 0.1)',
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201, 162, 39, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201, 162, 39, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
