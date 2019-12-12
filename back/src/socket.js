const GameController = require('./game-controller');

module.exports = (io) => {
  const gameController = new GameController();

  io.on('connection', (socket) => {

    socket.on('create_game', ({ pseudo, type }) => {
      const gameCode = gameController.createGame(pseudo, type, socket);
      socket.emit('game_code', gameCode);
    });

    socket.on('join_game', ({ pseudo, id }) => {
      if (gameController.gameExists(id)) {
        gameController.joinGame(pseudo, socket, id);
        socket.emit('game_code', id);

        if (gameController.canGameStart(id)) {
          gameController.startGame(id);
        }

      } else {
        socket.emit('join_error')
      }
    })
  });
};
