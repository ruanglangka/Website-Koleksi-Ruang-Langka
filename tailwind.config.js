/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#F7F9FC',
          100: '#EAF0F8',
          200: '#D7E3F2',
          300: '#BFD2E9',
        },
        ink: {
          800: '#16233A',
          900: '#0D1626',
        },
        navy: {
          50: '#EEF3FB',
          100: '#CFDDF3',
          400: '#2F5C8A',
          500: '#1E4670',
          600: '#173657',
          700: '#102540',
        },
        gilt: {
          300: '#E9CE7F',
          400: '#C9A227',
          500: '#A6811A',
        },
        teal: {
          500: '#2F5D5A',
          600: '#234845',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Playfair Display"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        aksara: ['"Noto Serif"', 'serif'],
      },
      backgroundImage: {
        'paper-texture':
          "radial-gradient(circle at 1px 1px, rgba(30,70,112,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        book: '0 10px 25px -8px rgba(27,20,13,0.35), 0 2px 6px rgba(27,20,13,0.15)',
      },
    },
  },
  plugins: [],
}
