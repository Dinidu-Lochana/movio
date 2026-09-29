const c = (name) => `oklch(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.dark'],
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'Google Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: c('background'),
        foreground: c('foreground'),
        surface: c('surface'),
        card: c('card'),
        primary: { DEFAULT: c('primary'), foreground: c('primary-foreground'), deep: c('primary-deep') },
        secondary: c('secondary'),
        muted: { DEFAULT: c('muted'), foreground: c('muted-foreground') },
        accent: c('accent'),
        gold: c('gold'),
        border: 'var(--border)',
      },
      borderRadius: {
        '3xl': 'calc(var(--radius) + 12px)',
      },
      zIndex: { 100: '100' },
    },
  },
  plugins: [],
};
