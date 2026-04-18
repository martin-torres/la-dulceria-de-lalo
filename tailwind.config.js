/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        secondary: 'var(--secondary)',
        'secondary-hover': 'var(--secondary-hover)',
        accent: 'var(--accent)',
        'brand-bg': 'var(--background)',
        'brand-surface': 'var(--surface)',
        'brand-text': 'var(--text)',
        'brand-text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        brand: ['var(--font-brand)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
