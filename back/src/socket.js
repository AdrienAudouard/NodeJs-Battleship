const GameController = require('./game-controller');

module.exports = (io) => {
  const gameController = new GameController();

  io.on('connection', (socket) => {
    let gameCode;

    socket.on('new_marker', (m) => {
      io.emit('new_marker', m);
    });

    socket.on('create_game', ({ pseudo, type }) => {
      gameCode = gameController.createGame(pseudo, type, socket);
      socket.emit('game_code', gameCode);
    });

    socket.on('join_game', ({ pseudo, id }) => {
      if (gameController.gameExists(id)) {
        gameController.joinGame(pseudo, socket, id);
        socket.emit('game_code', gameCode);

        if (gameController.canGameStart(id)) {
          gameController.startGame(id);
        }

      } else {
        socket.emit('join_error')
      }
    })
  });
};
