/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#fafafa',
        primary: '#f5c518',
        'primary-foreground': '#0a0a0a',
        secondary: '#1a1a1a',
        'secondary-foreground': '#fafafa',
        muted: '#262626',
        'muted-foreground': '#a3a3a3',
        accent: '#f5c518',
        'accent-foreground': '#0a0a0a',
        card: '#141414',
        'card-foreground': '#fafafa',
        border: '#262626',
        destructive: '#ef4444',
        'destructive-foreground': '#fafafa',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
      },
      keyframes: {
        'print-paper': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'cut-paper': {
          '0%': { clipPath: 'inset(0 0 0 0)' },
          '50%': { clipPath: 'inset(0 0 50% 0)' },
          '100%': { clipPath: 'inset(0 0 100% 0)', opacity: '0' },
        },
        'bulb-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px #f5c518)' },
          '50%': { filter: 'drop-shadow(0 0 20px #f5c518)' },
        },
      },
      animation: {
        'print-paper': 'print-paper 2s ease-out forwards',
        'cut-paper': 'cut-paper 0.5s ease-in forwards',
        'bulb-glow': 'bulb-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
