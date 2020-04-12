import minify from 'rollup-plugin-babel-minify';

module.exports = {
  input: 'src/compare/main.js',
  output: {
    file: 'compare-year/bundle.js',
    format: 'iife'
  },
  plugins: [minify()]
};

