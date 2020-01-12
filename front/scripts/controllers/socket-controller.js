const os = require("os");
const {SocketEvents} = require('battleship-shared-module');

module.exports = class SocketController {
  constructor() {
    const options = {
      reconnection: false,
      query: {
        platform: 'web',
        accept: '1.0.0',
      }
    };

    if (process.env.NODE_ENV !== 'production') {
      const host = os.hostname();
      const port = process.env.PORT || 5555;
      this._socket = io(`${host}:${port}`, options);
    } else {
      this._socket = io(options);
    }

    this.onNewMarker = (x, y, touched, killed, lastBoatTouched) => {};
    this.onGamecreated = (code) => {};
    this.onError = (err) => {};
    this.onGameStart = (boats, boardSize) => {};
    this.onEndTurn = () => {};
    this.onStartTurn = () => {};
    this.onBoardHited = (x, y, touched, killed, lastBoatTouched) => {};
    this.onWin = () => {};
    this.onLoose = () => {};
    this.onJoinableGames = (games) => {};
    this.onGameEndWithError = (msg) => {};
    this.onLoading = () => {};
    this.onDisconnect = () => {};

    this._socket.on('connect_error', () => {
      this.onDisconnect();
    });

    this._socket.on('disconnect', () => {
      this.onDisconnect();
    });

    this._socket.on(SocketEvents.JOINABLE_GAMES, (games) => {
      this.onJoinableGames(games);
    });

    this._socket.on(SocketEvents.LOADING, () => {
      this.onLoading();
    });

    this._socket.on(SocketEvents.GAME_END_WITH_ERROR, (msg) => {
      this.onGameEndWithError(msg);
    });

    this._socket.on(SocketEvents.PLAYER_TURN, () => {
      this.onStartTurn();
    });

    this._socket.on(SocketEvents.WIN, () => {
      this.onWin();
    });

    this._socket.on(SocketEvents.LOOSE, () => {
      this.onLoose();
    });

    this._socket.on(SocketEvents.PLAYER_END_TURN, () => {
      this.onEndTurn();
    });

    this._socket.on(SocketEvents.NEW_MARKER, ({x, y, touched, killed, lastBoatTouched}) => {
      this.onNewMarker(x, y, touched, killed, lastBoatTouched);
    });

    this._socket.on(SocketEvents.BOARD_HITED, ({x, y, touched, killed, lastBoatTouched}) => {
      this.onBoardHited(x, y, touched, killed, lastBoatTouched);
    });

    this._socket.on(SocketEvents.GAME_CODE, (code) => {
      this.onGamecreated(code);
    });

    this._socket.on(SocketEvents.JOIN_ERROR, () => {
      this.onError('The game do not exists');
    });

    this._socket.on(SocketEvents.GAME_START, ({board, boardSize}) => {
      this.onGameStart(board, boardSize);
    });

    this._socket.on(SocketEvents.WRONG_HEADER, (msg) => {
      console.error(`Socket error: ${msg}`);
    });
  }

  replay(pseudo) {
    this._socket.emit(SocketEvents.REPLAY, pseudo);
  }

  joinGame(pseudo, id) {
    this._socket.emit(SocketEvents.JOIN_GAME, {pseudo, id});
  }

  createGame(pseudo, type) {
    this._socket.emit(SocketEvents.CREATE_GAME, {pseudo, type});
  }

  addNewMarker(x, y) {
    this._socket.emit(SocketEvents.NEW_MARKER, {x, y});
  }
};
