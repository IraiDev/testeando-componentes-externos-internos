/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {
         animation: {
            'snackbar-enter': 'snackbar-enter-animation 500ms',
            'snackbar-exit': 'snackbar-exit-animation 800ms',
         },
      },
   },
   plugins: [],
}
