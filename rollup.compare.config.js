import { terser } from "rollup-plugin-terser";

module.exports = {
  input: 'src/compare/main.js',
  output: {
    file: 'compare-year/bundle.js',
    format: 'iife'
  },
  plugins: [terser()]
};

