/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pahad: {
          cream: '#FFF0E1',
          'cream-light': '#FDF9F5',
          'cream-muted': '#F5E6D6',
          green: '#064B32',
          'green-dark': '#043423',
          'green-light': '#0a6b47',
          'green-hover': '#08573a',
          charcoal: '#202522',
          'charcoal-muted': '#4B524E',
          sage: '#879B86',
          'sage-light': '#D6DFD5',
          'sage-dark': '#5D735C',
          gold: '#D9BB87',
          'gold-light': '#F2E2C4',
          'gold-dark': '#B89253',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        script: ['"Alex Brush"', 'cursive'],
        display: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(6, 75, 50, 0.05), 0 2px 6px -1px rgba(6, 75, 50, 0.03)',
        'premium': '0 20px 40px -15px rgba(6, 75, 50, 0.08), 0 0 1px 1px rgba(217, 187, 135, 0.25)',
        'premium-hover': '0 25px 50px -12px rgba(6, 75, 50, 0.15), 0 0 1px 1px rgba(217, 187, 135, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(217, 187, 135, 0.4)',
      },
      backgroundImage: {
        'mountain-pattern': "radial-gradient(#879B86 0.75px, transparent 0.75px)",
      }
    },
  },
  plugins: [],
}
