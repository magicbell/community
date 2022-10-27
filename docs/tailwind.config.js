module.exports = {
  purge: [
    './docs/**/*.mdx',
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
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
  variants: {
    extend: {},
  },
  plugins: [],
};
