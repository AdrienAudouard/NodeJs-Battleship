const express = require('express');
const SocketIO = require('socket.io');
const configSockets = require('./src/socket.js');
const os = require("os");

const app = express();
const port = process.env.PORT || 5555;

app.use(express.static(`${__dirname}/public`));

const server = app.listen(port);

const io = SocketIO(server);

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

configSockets(io);
console.log(os.hostname());
console.log(`Magic happens at http://localhost:${port}`);
