/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{gjs,gts,hbs,html,js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

