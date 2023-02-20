module.exports = {
  content: [
    './docs/**/*.mdx',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        darkGrey: '#9187B2',
        darkPurple: '#230F65',
        lightPurple: '#5225C1',
        pink: '#C977FE',
      },
      fontFamily: {
        sans: ['HarmoniaSans', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
