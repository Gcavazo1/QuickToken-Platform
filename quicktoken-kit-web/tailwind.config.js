/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk color palette - dark with orange/red accents
        'black': '#0A0A0A',
        'dark-teal': '#0B3B39',
        'charcoal': '#1A1A1A',
        'teal': '#45B5C4',
        'gold': '#F9B900',
        'orange': '#F26430',
        'maroon': '#7D1D3F',
      },
      backgroundColor: {
        'primary': '#0A0A0A',
        'secondary': '#1A1A1A',
      },
      boxShadow: {
        'neon-teal': '0 0 5px #45B5C4, 0 0 20px rgba(69, 181, 196, 0.3)',
        'neon-orange': '0 0 5px #F26430, 0 0 20px rgba(242, 100, 48, 0.3)',
        'neon-gold': '0 0 5px #F9B900, 0 0 20px rgba(249, 185, 0, 0.3)',
      },
    },
  },
  plugins: [],
} 