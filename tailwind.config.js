/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#008541',
        'primary-shade': '#FBFBFB',
        secondary: '#36BDC8',
        dark: '#0B2628',
        mute: '#969AAB',
        'light-gray': '#EBEBEB',
        success: '#21d666',
        default: '#EDEDED',
        warning: '#FFBE40',
        danger: '#D80D1D',
        info: '#1C366A',
        gray: '#888E9D',
        'gray-2': '#BBBBBB',
        'gray-4': '#EFEFEF',
      },
      fontSize: {
        xs: '11px',
      },
      boxShadow: {
        'small-card': '0 0 20px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
