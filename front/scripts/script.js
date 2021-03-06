const CanvasView = require('./views/canva-view');
const GameView = require('./views/game-view');
const AssetsLoader = require('./utils/assets-loader');
const GameController = require('./controllers/game-controller');
const SocketController = require('./controllers/socket-controller');
const GameFormController = require('./controllers/game-form-controller');
const MARKER_TYPE = require('./model/marker-type');
const MessageView = require('./views/message-view');
const BOARD_CONTAINER = require('./utils/board-container');

let canvasView;
let mainGameView;
let secondGameView;
let gameController;
let socketController;
let gameFormController;

window.onload = () => {
  AssetsLoader.load([
    { id: MARKER_TYPE.TARGET_NO_HIT, url: '/assets/black-circle.png' },
    { id: MARKER_TYPE.TARGET_HIT, url: '/assets/red-cross.png' },
    { id: MARKER_TYPE.PLAYER_BOAT, url: '/assets/player-boat.png' },
    { id: MARKER_TYPE.KILLED_BOAT, url: '/assets/jeremy.jpg' }
  ], () => {
    socketController = new SocketController();
    gameFormController = new GameFormController();
    canvasView = new CanvasView();

    socketController.onDisconnect = () => {
      const message = new MessageView('An error occured with the server, please reload the page !', 'Error');

      message.show(() => {
        document.location.reload(true);
      });
    };

    socketController.onError = (err) => {
      const message = new MessageView(err, 'Error');
      message.show();
    };

    socketController.onJoinableGames = (games) => {
      gameFormController.setGameList(games);
    };

    socketController.onLoading = () => {
      gameFormController.showInfoMessage('Loading game...')
    };

    socketController.onGameEndWithError = (msg) => {
      canvasView.clear();
      if (gameController) {
        gameController.endGame('', false);
      }

      gameFormController.showGameErrorMsg(msg);
    };

    gameFormController.onCreate = (pseudo, type) => {
      socketController.createGame(pseudo, type);
    };

    gameFormController.onJoin = (pseudo, id) => {
      socketController.joinGame(pseudo, id);
    };

    gameFormController.onReplay = (pseudo) => {
      socketController.replay(pseudo);
    };

    socketController.onGamecreated = (code) => {
      gameFormController.showGameCode(code);
    };

    socketController.onGameStart = (boats, boardSize) => {
      gameFormController.hideAllForm();
      initGame(boardSize);
      gameController.setPlayerBoats(boats);

    };
  });
};

const initGame = (boardSize) => {
  initMainGameView(boardSize);
  initSecondGameView(boardSize);

  gameController = new GameController(mainGameView, secondGameView, socketController);

  gameController.onEndGame = (message) => {
    canvasView.clear();
    gameFormController.showEndGameForm(message);
  }
};

const initMainGameView = (boardSize) => {
  mainGameView = new GameView(boardSize, BOARD_CONTAINER.GAME_BOARD);
};

const initSecondGameView = (boardSize) => {
  secondGameView = new GameView(boardSize, BOARD_CONTAINER.PLAYER_BOARD);
};
