import minify from 'rollup-plugin-babel-minify';

module.exports = {
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
    format: 'iife'
  },
  plugins: [minify()]
};

