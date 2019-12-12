const Marker = require('../model/marker');
const MARKER_TYPE = require('../model/marker-type');
const InfoView = require('../views/info-view');

module.exports = class GameController {
  constructor(gameView, playerGameView, socketController) {
    this.gameView = gameView;
    this.playerGameView = playerGameView;
    this.socketController = socketController;
    this.infoView = new InfoView(this.playerGameView['_ctx'], this.gameView['_y']);
    this._isPlayerTurn = false;

    this.gameView.onClick = (x, y) => {
      if (!this._isPlayerTurn) { return; }
      this.socketController.addNewMarker(x, y);
    };

    this.socketController.onNewMarker = (x, y, touched, killed) => { this.onNewMarker(x, y, touched, killed); };

    this.socketController.onBoardHited = (x, y, touched, killed) => {
      this.onBoardHited(x, y, touched, killed);
    };

    this.socketController.onStartTurn = () => {
      this._isPlayerTurn = true;
      this.infoView.drawInfo('It\'s your turn')
    };

    this.socketController.onEndTurn = () => {
      this._isPlayerTurn = false;
      this.infoView.drawInfo('it\'s the enemy\'s turn');
    };
  }

  setPlayerBoats(boats) {
    this.boats = boats;

    this.playerGameView.boats = boats;
    this.playerGameView.draw();
  }

  onBoardHited(x, y, touched, killed) {
    const type = touched ? (killed ? MARKER_TYPE.KILLED_BOAT : MARKER_TYPE.TARGET_HIT) : MARKER_TYPE.TARGET_NO_HIT;

    this.playerGameView.addMarker(new Marker(x, y, type));
    this.playerGameView.draw();
  }

  onNewMarker(x, y, touched, killed) {
    const type = touched ? (killed ? MARKER_TYPE.KILLED_BOAT : MARKER_TYPE.TARGET_HIT) : MARKER_TYPE.TARGET_NO_HIT;

    this.gameView.addMarker(new Marker(x, y, type));
    this.gameView.draw();
  }
};
