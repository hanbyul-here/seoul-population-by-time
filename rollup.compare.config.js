import { terser } from "rollup-plugin-terser";

module.exports = {
  input: 'compare-year/src/main.js',
  output: {
    file: 'compare-year/bundle.js',
    format: 'iife'
  },
  plugins: [terser()]
};

