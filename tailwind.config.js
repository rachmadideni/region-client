/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

const fontFamily = {
  sans: ["Roboto", "sans-serif"],
  serif: ["Roboto Slab", "serif"],
  body: ["Roboto", "sans-serif"],
};

export default withMT({
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554"
        },
        silver: { "50": '#FFFFFF', "100": '#FFFFFF', "200": '#FFFFFF', "300": '#F5F5F5', "400": '#E0E0E0', "500": '#CCCCCC', "600": '#B0B0B0', "700": '#949494', "800": '#787878', "900": '#5C5C5C', "950": '#4E4E4E' }
      }
    },
    fontFamily: {
      // 'body': ['Inter'],
      // 'sans': ['Inter'],
      'sans': ["Roboto", "sans-serif"],
      'serif': ["Roboto Slab", "serif"],
      'body': ["Roboto", "sans-serif"],
    }
    // fontFamily: {...fontFamily}
  },
  // eslint-disable-next-line no-undef
  // plugins: [require('flowbite/plugin')],
})