import io from 'socket.io-client';
import {SOCKET_URL} from "../env";

class SocketProvider {
  constructor() {
    const opts = {reconnection: true};
    this.socket = io(SOCKET_URL, opts);
    this.initCallbacks();
    this.initSocketsListeners();
  }

  initCallbacks() {
    this.onJoinableGames = game => {};
    this.onGameCode = (code) => {};
    this.onGameStart = (board, gameSize) => {};
    this.onNewMarker = (x, y, touched, killed, lastBoatTouched) => {};
    this.onStartTurn = () => {};
    this.onEndTurn = () => {};
    this.onBoardHited = (x, y, touched, killed, lastBoatTouched) => {};
    this.onWin = () => {};
    this.onLoose = () => {};
  }

  askGames() {
    this.socket.emit('ask_games');
  }

  createGame(game, pseudo) {
    this.socket.emit('create_game', {pseudo, type: game});
  }

  joinGame(game) {
    this.socket.emit('join_game', {pseudo: 'test', id: game.code})
  }

  addNewMarker(x, y) {
    this.socket.emit('new_marker', {x, y});
  }

  initSocketsListeners() {
    this.socket.on('connect', () => {
    });

    this.socket.on('joinable_games', game => {
      this.onJoinableGames(game);
    });

    this.socket.on('game_code', (code) => {
      this.onGameCode(code)
    });

    this.socket.on('game_start', ({ board, boardSize }) => {
      this.onGameStart(board, boardSize);
    });

    this.socket.on('new_marker', ({x, y, touched, killed, lastBoatTouched}) => {
      this.onNewMarker(x, y, touched, killed, lastBoatTouched);
    });

    this.socket.on('board_hited', ({x, y, touched, killed, lastBoatTouched}) => {
      this.onBoardHited(x, y, touched, killed, lastBoatTouched);
    });

    this.socket.on('player_turn', () => {
      this.onStartTurn();
    });

    this.socket.on('player_end_turn', () => {
      this.onEndTurn();
    });

    this.socket.on('win', () => {
      this.onWin();
    });

    this.socket.on('loose', () => {
      this.onLoose();
    });
  }
}

export default new SocketProvider();
