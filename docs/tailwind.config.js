/** @type {import('tailwindcss').Config} \*/
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

        /* Dark Magic */
        // Primary
        yellow: '#FFB224',
        lightYellow: '#FFC561',

        // Text
        default: '#EDEDEF',
        muted: '#A09FA6',
        link: '#9E8CFC',
        hover: '#BCAFFD',
        highlight: '#FFEF5C',
        error: ' #F16A50',

        // Gradient
        yellowOutlineStart: '#FFB224BF',
        yellowOutlineEnd: '#FFB22459',

        // Base
        app: '#1B1D29',
        app2: '#1E212F',
        bgDefault: '#23283B',
        bgHover: '#21283E',
        outlineDark: '#354061',
        darkGradientStart: '#23283d40',
        darkGradientEnd: '#1e212f0d',
        borderMuted: '#354061',

        // Old Colors
        darkGrey: '#9187B2',
        darkPurple: '#230F65',
        lightPurple: '#5225C1',
        pink: '#C977FE',
      },
      fontFamily: {
        sans: ['Source Sans Pro', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['Catamaran', 'Helvetica', 'Arial', 'sans-serif'],
        code: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
    },
  },
  plugins: [],
};
