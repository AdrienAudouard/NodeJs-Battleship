const CanvasView = require('./views/canva-view');
const GameView = require('./views/game-view');
const AssetsLoader = require('./utils/assets-loader');
const GameController = require('./controllers/game-controller');
const SocketController = require('./controllers/socket-controller');
const GameFormController = require('./controllers/game-form-controller');
const MARKER_TYPE = require('./model/marker-type');

let canvasView;
let mainGameView;
let secondGameView;
let gameController;
let socketController;
let gameFormController;

window.onload = () => {
  AssetsLoader.load([
    { id: MARKER_TYPE.TARGET_NO_HIT, url: '/assets/black-circe.png' },
    { id: MARKER_TYPE.TARGET_HIT, url: '/assets/red-cross.png' },
    { id: MARKER_TYPE.PLAYER_BOAT, url: '/assets/square-ship.png' },
    { id: MARKER_TYPE.KILLED_BOAT, url: '/assets/red-square-ship.png' }
  ], () => {
    socketController = new SocketController();
    gameFormController = new GameFormController();
    canvasView = new CanvasView();

    socketController.onError = (err) => {
      alert(err);
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

    socketController.onGameStart = (boats) => {
      gameFormController.hideAllForm();
      initGame();
      gameController.setPlayerBoats(boats);

    };
  });
};

const initGame = () => {
  initMainGameView();
  initSecondGameView();

  gameController = new GameController(mainGameView, secondGameView, socketController);

  gameController.onEndGame = (message) => {
    canvasView.clear();
    gameFormController.showEndGameForm(message);
  }
};

const initMainGameView = () => {
  const w = window.innerHeight * 0.7;
  const h = window.innerHeight * 0.7;
  const x = window.innerWidth / 2 - w / 2;
  const y = window.innerHeight / 2 - h / 2;

  mainGameView = new GameView(canvasView.ctx, w, h, x, y);
};

const initSecondGameView = () => {
  const w = window.innerHeight * 0.25;
  const h = window.innerHeight * 0.25;
  const x = window.innerWidth * 0.75;
  const y = window.innerHeight / 2 - h / 2;

  secondGameView = new GameView(canvasView.ctx, w, h, x, y);
};
