/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './src/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0a0a0a'
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#2a2a2a'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          'ui-sans-serif',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      boxShadow: {
        floating: '0 1px 2px 0 rgb(0 0 0 / 0.05), 0 10px 20px -10px rgb(0 0 0 / 0.2)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};


