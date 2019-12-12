const os = require("os");

module.exports = class SocketController {
  constructor() {
    const host = os.hostname();
    const port = process.env.PORT || 5555;
    this._socket = io();

    this.onNewMarker = (x, y, touched) => {};
    this.onGamecreated = (code) => {};
    this.onError = (err) => {};
    this.onGameStart = (boats) => {};
    this.onEndTurn = () => {};
    this.onStartTurn = () => {};
    this.onBoardHited = (x, y, touched) => {};
    this.onWin = () => {};
    this.onLoose = () => {};

    this._socket.on('player_turn', () => {
      this.onStartTurn();
    });

    this._socket.on('win', () => {
      this.onWin();
    });

    this._socket.on('loose', () => {
      this.onLoose();
    });

    this._socket.on('player_end_turn', () => {
      this.onEndTurn();
    });

    this._socket.on('new_marker', ({x, y, touched, killed}) => {
      this.onNewMarker(x, y, touched, killed);
    });

    this._socket.on('board_hited', ({x, y, touched, killed}) => {
      this.onBoardHited(x, y, touched, killed);
    });

    this._socket.on('game_code', (code) => {
      this.onGamecreated(code);
    });

    this._socket.on('join_error', () => {
      this.onError('The game do not exists');
    });

    this._socket.on('game_start', (boats) => {
      this.onGameStart(boats);
    });
  }

  joinGame(pseudo, id) {
    this._socket.emit('join_game', {pseudo, id});
  }

  createGame(pseudo, type) {
    this._socket.emit('create_game', {pseudo, type});
  }

  addNewMarker(x, y) {
    this._socket.emit('new_marker', {x, y});
  }
};
