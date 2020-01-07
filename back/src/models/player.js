const SOCKET_EVENTS = require('battleship-shared-module/src/socket-events');
const Playable = require('./playable');

module.exports = class Player extends Playable {
  constructor(pseudo, socket) {
    super(pseudo);

    this.socket = socket;
    this._setListeners();
  }

  _setListeners() {
    this.socket.on(SOCKET_EVENTS.NEW_MARKER, ({x, y}) => {
      this.onNewMarker(x, y);
    });
  }

  startLoading() {
    this.socket.emit(SOCKET_EVENTS.LOADING);
  }

  startGame(boardSize) {
    this.socket.emit(SOCKET_EVENTS.GAME_START, {board: this.board, boardSize: boardSize});
  }

  boardHitted(x, y, touched, killedBoat, lastBoatTouched) {
    this.socket.emit(SOCKET_EVENTS.BOARD_HITED, {x, y, touched, killed: killedBoat, lastBoatTouched});
  }

  newMarker(x, y, touched, killedBoat, lastBoatTouched) {
    this.socket.emit(SOCKET_EVENTS.NEW_MARKER, {x, y, touched, killed: killedBoat, lastBoatTouched});
  }

  loose() {
    this.socket.emit(SOCKET_EVENTS.LOOSE);
  }

  win() {
    this.socket.emit(SOCKET_EVENTS.WIN);
  }

  play() {
    this.socket.emit(SOCKET_EVENTS.PLAYER_TURN);
  }

  endTurn() {
    this.socket.emit(SOCKET_EVENTS.PLAYER_END_TURN);
  }

  clearListeners() {
    this.socket.removeAllListeners(SOCKET_EVENTS.NEW_MARKER);
  }

  endGameWithError(msg) {
    this.socket.emit(SOCKET_EVENTS.GAME_END_WITH_ERROR, msg);
  }

};
