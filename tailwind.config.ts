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
        // Dark Knight Color Palette - True to the Film
        gotham: {
          // Blacks and Charcoals - Batman's suit, shadows
          black: '#0a0a0c',
          void: '#0d0d0f',
          night: '#111114',
          dark: '#151518',
          charcoal: '#1a1a1e',

          // Steel and Gunmetal Grays - Buildings, infrastructure
          steel: '#252529',
          gunmetal: '#2d2d33',
          concrete: '#3a3a42',
          iron: '#4a4a54',
          silver: '#6a6a76',
          ash: '#8a8a96',

          // Cool Blues - Night scenes, police lights
          blue: {
            deep: '#0a1628',
            dark: '#132238',
            night: '#1a3050',
            steel: '#2a4a70',
            light: '#3a6090',
            glow: '#4a80b0',
          },

          // Deep Greens - Accents
          green: {
            dark: '#0a1a12',
            moss: '#1a2a20',
            sage: '#2a3a2a',
          },

          // Muted Browns - Urban decay
          brown: {
            rust: '#2a1a14',
            worn: '#3a2a1e',
            tan: '#4a3a28',
          },

          // Accent Colors - Warnings, signals
          warning: '#8b4513',  // Muted amber
          alert: '#a02020',   // Dark red
          signal: '#c4a000',  // Muted yellow/gold
        },
      },
      backgroundImage: {
        'gotham-gradient': 'linear-gradient(135deg, #0a0a0c 0%, #151518 25%, #1a3050 50%, #151518 75%, #0a0a0c 100%)',
        'steel-gradient': 'linear-gradient(180deg, #1a1a1e 0%, #252529 100%)',
        'night-gradient': 'radial-gradient(ellipse at top, #1a3050 0%, #0a0a0c 70%)',
      },
      boxShadow: {
        'gotham': '0 0 30px rgba(26, 48, 80, 0.3)',
        'signal': '0 0 20px rgba(196, 160, 0, 0.2)',
        'alert': '0 0 15px rgba(160, 32, 32, 0.3)',
        'inner-steel': 'inset 0 0 20px rgba(42, 74, 112, 0.1)',
      },
      animation: {
        'pulse-blue': 'pulse-blue 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        'pulse-blue': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(42, 74, 112, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(58, 96, 144, 0.5)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
