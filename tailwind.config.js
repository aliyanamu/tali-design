/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        paper: '#FAF8F3',
        surface: '#FFFFFF',
        charcoal: '#1A1714',
        cream: '#F0EBE0',
        // Trust spine
        watched: '#8A94A6',
        sign: '#2E9E6B',
        agent: '#8B7DE8',
        amber: '#E0A33E',
        // Neutrals
        ink: {
          900: '#1A1714',
          800: '#2D2A25',
          700: '#3F3B35',
          600: '#5C5750',
          500: '#7A746C',
          400: '#9B9590',
          300: '#C0BAB2',
          200: '#DDD9D2',
          100: '#EDEAE4',
          50:  '#F5F3EF',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(26,23,20,0.06)',
        'card-hover': '0 4px 20px 0 rgba(26,23,20,0.10)',
        'card-dark': '0 2px 12px 0 rgba(0,0,0,0.24)',
      },
      fontSize: {
        'hero': ['2.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'hero-sm': ['2rem', { lineHeight: '1.15', letterSpacing: '-0.015em', fontWeight: '600' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
