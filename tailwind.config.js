/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FFFFFF',
          100: '#F4F7FB',
          200: '#E7EEF7',
          300: '#D6E3F2',
        },
        ink: {
          800: '#0F1626',
          900: '#000000',
        },
        // Nilai diselaraskan dengan palet "heritage" — biru arsip khas Ruang Langka.
        navy: {
          50: '#EFF6FF',
          100: '#DCEBFA',
          400: '#5E9FE0',
          500: '#2F6FED',
          600: '#22539C',
          700: '#1B3F78',
        },
        gilt: {
          300: '#D9B65B',
          400: '#C9A227',
          500: '#A9840F',
        },
        teal: {
          500: '#2F5D5A',
          600: '#234845',
        },
        // Diambil dari warna kulit gajah pada ilustrasi referensi (#A8B8C0),
        // dipakai sebagai warna latar kartu (card) saat mode terang.
        mist: {
          50: '#F2F4F6',
          100: '#E5EAEC',
          200: '#D8DFE3',
          300: '#C2CDD3',
          400: '#A8B8C0',
        },
        obsidian: {
          DEFAULT: '#000000',
          card: '#0F1626',
          border: '#1E2A44',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        aksara: ['"IBM Plex Mono"', 'monospace'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'paper-texture':
          "radial-gradient(circle at 1px 1px, rgba(30,70,112,0.06) 1px, transparent 0)",
        'shelf-wood': 'linear-gradient(180deg, #7a5230 0%, #5c3d22 100%)',
      },
      boxShadow: {
        book: '0 10px 25px -8px rgba(27,20,13,0.35), 0 2px 6px rgba(27,20,13,0.15)',
        card: '0 8px 30px -12px rgba(27, 63, 120, 0.25)',
        'card-dark': '0 8px 30px -12px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        'book-open': {
          '0%': { transform: 'rotateY(0deg) scale(1)' },
          '40%': { transform: 'rotateY(-18deg) scale(1.04)' },
          '100%': { transform: 'rotateY(0deg) scale(1)' },
        },
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'book-open': 'book-open 0.7s ease-in-out',
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}