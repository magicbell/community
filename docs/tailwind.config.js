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

        // Background and borders
        bgApp: '#1B1D29',
        bgDefault: '#23283B',
        bgHover: '#262E45',
        borderMuted: '#354061',

        // Body Text
        textDefault: '#EDEDEF',
        textMuted: '#A09FA6',
        textHighlight: '#FFEF5C',
        textLinkHover: '#BCAFFD',
      },
      fontFamily: {
        sans: ['HarmoniaSans', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {
      borderWidth: ['last'],
    },
  },
  plugins: [],
};
