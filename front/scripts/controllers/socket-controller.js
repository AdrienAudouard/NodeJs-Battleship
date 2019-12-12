module.exports = class SocketController {
  constructor() {
    this._socket = io('http://localhost:5555');

    this.onNewMarker = (x, y) => {};
    this.onGamecreated = (code) => {};
    this.onError = (err) => {};
    this.onGameStart = () => {};

    this._socket.on('new_marker', ({x, y}) => {
      this.onNewMarker(x, y);
    });

    this._socket.on('game_code', (code) => {
      this.onGamecreated(code);
    });

    this._socket.on('join_error', () => {
      this.onError('The game do not exists');
    });

    this._socket.on('game_start', () => {
      this.onGameStart();
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
