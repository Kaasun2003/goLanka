/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        lanka: {
          maroon: '#8D153A',   // Sri Lankan flag maroon
          gold: '#FFBE29',     // Sri Lankan flag saffron gold
          orange: '#EB7400',   // Sri Lankan flag orange
          green: '#00534E',    // Sri Lankan flag teal/green
          navy: '#0A192F',     // Modern deep navy
          slate: '#1E293B',
          card: '#111827',
          accent: '#2563EB'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(255, 190, 41, 0.25)',
        'glow-teal': '0 0 20px rgba(0, 168, 150, 0.25)'
      }
    },
  },
  plugins: [],
}
