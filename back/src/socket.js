const GameController = require('./game-controller');
const SOCKET_EVENTS = require('./utils/socket-events');

module.exports = (io) => {
  const gameController = new GameController();

  const updateJoinableGames = () => {
    io.emit(SOCKET_EVENTS.JOINABLE_GAMES, gameController.getNotFullGames());
  };

  io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
    let lastGameCode;

    socket.emit(SOCKET_EVENTS.JOINABLE_GAMES, gameController.getNotFullGames());

    socket.on(SOCKET_EVENTS.CREATE_GAME, ({ pseudo, type }) => {
      const gameCode = gameController.createGame(pseudo, type, socket);
      lastGameCode = gameCode;

      if (!gameController.isGameStarted(lastGameCode)) {
        socket.emit(SOCKET_EVENTS.GAME_CODE, gameCode);
        updateJoinableGames();
      }
    });

    socket.on(SOCKET_EVENTS.JOIN_GAME, ({ pseudo, id }) => {
      if (gameController.gameExists(id)) {
        if (gameController.canJoin(id)) {
          lastGameCode = id;
          gameController.joinGame(pseudo, socket, id);
          socket.emit(SOCKET_EVENTS.GAME_CODE, id);
          updateJoinableGames();

          if (gameController.canGameStart(id)) {
            gameController.startGame(id);
          }
        } else {
          socket.emit(SOCKET_EVENTS.JOIN_ERROR);
        }

      } else {
        socket.emit(SOCKET_EVENTS.JOIN_ERROR);
      }
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      if (lastGameCode === undefined) {
        return;
      }

      if (gameController.gameExists(lastGameCode)) {
        if (!gameController.isGameStarted(lastGameCode)) {
          if (gameController.removePlayerFromGame(lastGameCode, socket)) {
            updateJoinableGames();
          }
        } else {
          gameController.endGameWithError(lastGameCode);
        }
      }
    });

    socket.on(SOCKET_EVENTS.REPLAY, (pseudo) => {
      if (lastGameCode === undefined) {
        socket.emit(SOCKET_EVENTS.JOIN_ERROR);
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
