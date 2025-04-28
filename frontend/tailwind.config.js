/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'background-white': '#FFFFFF',
        'background-gray': '#FAFAFA',
        primary: '#0A0A0A',
        secondary: '#737373',
        blue: '#002BFF',
        'icon-primary': '#737373',
        divider: '#E5E5E5',
      },
    },
  },
  plugins: [],
}
