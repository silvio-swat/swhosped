/** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{html,ts}",
//     "./node_modules/primeng/**/*.{js,ts,html}" // Permite que o Tailwind estilize componentes PrimeNG
//   ],
//   theme: {
//     extend: {},
//   }
// }

const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    "./node_modules/primeng/**/*.{js,ts,html}" // Permite que o Tailwind estilize componentes PrimeNG
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

