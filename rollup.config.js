import { terser } from "rollup-plugin-terser";

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [terser()]
};

