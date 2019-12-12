const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './scripts/script.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './public'),
  },
  devServer: {
    port: 3001 // Specify a port number to listen for requests
  },
  plugins: [
    new CopyPlugin([
      { from: './assets', to: path.resolve(__dirname, './assets') },
      { from: './scripts/socket.io.js', to: path.resolve(__dirname, 'scripts/socket.io.js') },
      { from: './styles', to: path.resolve(__dirname, './styles') },
      { from: './index.html', to: path.resolve(__dirname, '../public') },
    ]),
  ]};
