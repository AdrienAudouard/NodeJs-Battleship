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
    this.onEndGame = (message) => {};

    this.gameView.onClick = (x, y) => {
      if (!this._isPlayerTurn) { return; }
      this.socketController.addNewMarker(x, y);
    };

    this.socketController.onNewMarker = (x, y, touched, killed, lastBoatTouched) => { this.onNewMarker(x, y, touched, killed, lastBoatTouched); };

    this.socketController.onBoardHited = (x, y, touched, killed, lastBoatTouched) => {
      this.onBoardHited(x, y, touched, killed, lastBoatTouched);
    };

    this.socketController.onWin = () => {
      this.endGame('You win !');
    };

    this.socketController.onLoose = () => {
      this.endGame('You loose !');
    };

    this.socketController.onStartTurn = () => {
      this._isPlayerTurn = true;
      this.infoView.drawInfo('It\'s your turn')
    };

    this.socketController.onEndTurn = () => {
      this._isPlayerTurn = false;
      this.infoView.drawInfo('It\'s the enemy\'s turn');
    };
  }

  endGame(message, useCallback = true) {
    this.infoView.clear();
    this.gameView.onDestroy();
    this.playerGameView.onDestroy();
    if (useCallback) {
      this.onEndGame(message);
    }
  }

  setPlayerBoats(boats) {
    this.boats = boats;

    boats.forEach((boat) => {
      boat.points.forEach((point) => {
        this.playerGameView.addMarker(new Marker(point.x, point.y, MARKER_TYPE.PLAYER_BOAT));
      });
    });

    this.playerGameView.boats = boats;
  }

  onBoardHited(x, y, touched, killed, lastBoatTouched) {
    const type = touched ? (killed ? MARKER_TYPE.KILLED_BOAT : MARKER_TYPE.TARGET_HIT) : MARKER_TYPE.TARGET_NO_HIT;
    const marker = new Marker(x, y, type);

    if (touched) {
      marker.tag = lastBoatTouched;
    }

    if (killed) {
      this.playerGameView.markers.filter((m) => m.tag === lastBoatTouched).forEach((m) => m.type = MARKER_TYPE.KILLED_BOAT);
    }

    this.playerGameView.addMarker(marker);
  }

  onNewMarker(x, y, touched, killed, lastBoatTouched) {
    const type = touched ? (killed ? MARKER_TYPE.KILLED_BOAT : MARKER_TYPE.TARGET_HIT) : MARKER_TYPE.TARGET_NO_HIT;
    const marker = new Marker(x, y, type);

    if (touched) {
      marker.tag = lastBoatTouched;
    }

    if (killed) {
      this.gameView.markers.filter((m) => m.tag === lastBoatTouched).forEach((m) => m.type = MARKER_TYPE.KILLED_BOAT);
    }

    this.gameView.addMarker(marker);
  }
};
