const GameController = require('./game-controller');
const PlatformController = require('./platform-controller');
const {SocketEvents} = require('battleship-shared-module');
const checkVersionHeader = require('./middleware/check-version');
const checkHeader = require('./middleware/check-header');

module.exports = (io) => {
  const gameController = new GameController();
  const platformController = new PlatformController();

  io.use(checkHeader);
  io.use(checkVersionHeader);

  const updateJoinableGames = () => {
    io.emit(SocketEvents.JOINABLE_GAMES, gameController.getNotFullGames());
  };

  io.on(SocketEvents.CONNECTION, (socket) => {
    let lastGameCode;

    const {platform} = socket.handshake.query;

    if (platform) {
      platformController.newConnection(platform);
    }

    socket.emit(SocketEvents.JOINABLE_GAMES, gameController.getNotFullGames());

    socket.on(SocketEvents.ASK_JOINABLE_GAMES, () => {
      socket.emit(SocketEvents.JOINABLE_GAMES, gameController.getNotFullGames());
    });

    socket.on(SocketEvents.CREATE_GAME, ({ pseudo, type }) => {
      const gameCode = gameController.createGame(pseudo, type, socket);
      lastGameCode = gameCode;

      if (!gameController.isGameStarted(lastGameCode)) {
        socket.emit(SocketEvents.GAME_CODE, gameCode);
        updateJoinableGames();
      }
    });

    socket.on(SocketEvents.JOIN_GAME, ({ pseudo, id }) => {
      if (gameController.gameExists(id)) {
        if (gameController.canJoin(id)) {
          lastGameCode = id;
          gameController.joinGame(pseudo, socket, id);
          socket.emit(SocketEvents.GAME_CODE, id);
          updateJoinableGames();

          if (gameController.canGameStart(id)) {
            gameController.startGame(id);
          }
        } else {
          socket.emit(SocketEvents.JOIN_ERROR);
        }

      } else {
        socket.emit(SocketEvents.JOIN_ERROR);
      }
    });

    socket.on(SocketEvents.QUIT_GAME, () => {
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

    socket.on(SocketEvents.DISCONNECT, () => {
      if (platform) {
        platformController.newDeconnection(platform);
      }

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

    socket.on(SocketEvents.REPLAY, (pseudo) => {
      if (lastGameCode === undefined) {
        socket.emit(SocketEvents.JOIN_ERROR);
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
