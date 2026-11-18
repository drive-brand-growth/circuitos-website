import type { Config } from 'tailwindcss'

/**
 * Design tokens. Values live as CSS variables in app/globals.css.
 * Use these names in class lists. Do not add one off hex values.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: token('ink'),
        sunken: token('sunken'),
        surface: token('surface'),
        raised: token('raised'),
        line: token('line'),
        'line-strong': token('line-strong'),
        fg: token('fg'),
        soft: token('soft'),
        muted: token('muted'),
        subtle: token('subtle'),
        faint: token('faint'),
        accent: token('accent'),
        'accent-strong': token('accent-strong'),
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // Floor for small text. Captions (xs) are 14px and small body copy (sm) is 16px on every screen.
        xs: ['0.875rem', { lineHeight: '1.5' }],
        sm: ['1rem', { lineHeight: '1.6' }],
        eyebrow: ['0.875rem', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '500' }],
        display: ['clamp(2.75rem, 1.55rem + 5.4vw, 5.75rem)', { lineHeight: '1.02', letterSpacing: '-0.045em', fontWeight: '600' }],
        title: ['clamp(2rem, 1.45rem + 2.4vw, 3.5rem)', { lineHeight: '1.06', letterSpacing: '-0.035em', fontWeight: '600' }],
        heading: ['clamp(1.5rem, 1.3rem + 0.9vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '600' }],
        subhead: ['1.1875rem', { lineHeight: '1.35', letterSpacing: '-0.015em', fontWeight: '600' }],
        lead: ['clamp(1.125rem, 1.02rem + 0.5vw, 1.375rem)', { lineHeight: '1.5', letterSpacing: '-0.012em' }],
        body: ['1.0625rem', { lineHeight: '1.65' }],
      },
      spacing: {
        gutter: 'var(--gutter)',
        section: 'var(--section)',
        'section-sm': 'var(--section-sm)',
        header: 'var(--header)',
      },
      maxWidth: {
        shell: '72rem',
        measure: '42rem',
      },
      borderRadius: {
        panel: '1rem',
        control: '0.625rem',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
export default config
