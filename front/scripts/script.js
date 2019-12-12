const CanvasView = require('./views/canva-view');
const GameView = require('./views/game-view');
const AssetsLoader = require('./utils/assets-loader');
const GameController = require('./controllers/game-controller');
const SocketController = require('./controllers/socket-controller');
const GameFormController = require('./controllers/game-form-controller');

let canvasView;
let mainGameView;
let secondGameView;
let gameController;
let socketController;
let gameFormController;

window.onload = () => {
  AssetsLoader.load([
    { id: 'target', url: '/assets/black-circe.png' },
    { id: 'cross', url: '/assets/red-cross.png' },
    { id: 'ship', url: '/assets/square-ship.png' }
  ], () => {
    socketController = new SocketController();
    gameFormController = new GameFormController();

    socketController.onError = (err) => {
      alert(err);
    };

    gameFormController.onCreate = (pseudo, type) => {
      socketController.createGame(pseudo, type);
    };

    gameFormController.onJoin = (pseudo, id) => {
      socketController.joinGame(pseudo, id);
    };

    socketController.onGamecreated = (code) => {
      gameFormController.showGameCode(code);
    };

    socketController.onGameStart = () => {
      gameFormController.hideAllForm();
      initGame();
    };
  });
};

const initGame = () => {
  canvasView = new CanvasView();

  initMainGameView();
  initSecondGameView();

  gameController = new GameController(mainGameView, socketController);
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
