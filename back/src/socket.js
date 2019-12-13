const GameController = require('./game-controller');

module.exports = (io) => {
  const gameController = new GameController();

  const updateJoinableGames = () => {
    io.emit('joinable_games', gameController.getNotFullGames());
  };

  io.on('connection', (socket) => {
    let lastGameCode;

    socket.emit('joinable_games', gameController.getNotFullGames());

    socket.on('create_game', ({ pseudo, type }) => {
      const gameCode = gameController.createGame(pseudo, type, socket);
      lastGameCode = gameCode;
      socket.emit('game_code', gameCode);
      updateJoinableGames();
    });

    socket.on('join_game', ({ pseudo, id }) => {
      if (gameController.gameExists(id)) {
        if (gameController.canJoin(id)) {
          lastGameCode = id;
          gameController.joinGame(pseudo, socket, id);
          socket.emit('game_code', id);

          if (gameController.canGameStart(id)) {
            gameController.startGame(id);
          }
        } else {
          socket.emit('join_error');
        }

      } else {
        socket.emit('join_error')
      }
    });

    socket.on('disconnect', () => {
      if (lastGameCode === undefined) {
        return;
      }

      if (gameController.gameExists(lastGameCode)) {
        if (gameController.removePlayerFromGame(lastGameCode, socket)) {
          updateJoinableGames();
        }
      }
    });

    socket.on('replay', (pseudo) => {
      if (lastGameCode === undefined) {
        socket.emit('join_error');
        return;
      }

      if (gameController.gameExists(lastGameCode)) {
        gameController.joinGame(pseudo, socket, lastGameCode);

        if (gameController.canGameStart(lastGameCode)) {
          gameController.startGame(lastGameCode);
        }
      } else {
        gameController.createGameWithCode(lastGameCode, pseudo, socket);
      }
    })
  });
};
