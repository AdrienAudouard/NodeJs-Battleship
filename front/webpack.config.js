const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './scripts/script.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './../back/public'),
  },
  devServer: {
    port: 3001 // Specify a port number to listen for requests
  },
  plugins: [
    new CopyPlugin([
      { from: './assets', to: path.resolve(__dirname, './../back/public/assets') },
      { from: './scripts/socket.io.js', to: path.resolve(__dirname, '../back/public/scripts/socket.io.js') },
      { from: './styles', to: path.resolve(__dirname, './../back/public/styles') },
      { from: './index.html', to: path.resolve(__dirname, './../back/public') },
    ]),
  ]};
