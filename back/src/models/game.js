const randomString = require('../utils/random-string');
const Player = require('./player');
const SOCKET_EVENTS = require('../utils/socket-events');

module.exports = class Game {
  constructor(pseudo, type, socket) {
    this.code = randomString(6);
    this.type = type;

    const splitedType = type.split('-');
    this.isStart = false;
    this.boats = splitedType.slice(1, splitedType.length - 2);
    this.boatCannotTouch = splitedType[splitedType.length - 2] === 'true';
    this.boardSize = parseInt(splitedType[splitedType.length - 1]);
    this.players = [new Player(pseudo, socket)];
    this.gameSize = type.split('-')[0];
    this.turn = 0;
    this.onEnd = () => {
    };
    this.onEndWithError = (msg) => {
    };

    this.timeOutCallBack = () => {
      this.nextTurn();
    };
  }

  start() {
    this.players.forEach((player) => {
      player.socket.emit(SOCKET_EVENTS.LOADING);
    });

    setImmediate(() => {
      try {
        this.isStart = true;
        this.players.forEach((player) => {
          player.generateBoard(this.boats, this.boatCannotTouch, this.boardSize);
          player.socket.emit(SOCKET_EVENTS.GAME_START, {board: player.board, boardSize: this.boardSize});

          player.socket.on(SOCKET_EVENTS.NEW_MARKER, ({x, y}) => {
            this.onNewMarker(x, y);
          });
        });

        this.nextTurn();
      } catch (e) {
        console.error(e.message);
        this.endGameWithError('The board cannot be generated, please retry with an other game type.');
      }
    });
  }

  onNewMarker(x, y) {
    const playerID = this.turn % this.gameSize;
    const ennemyID = (this.turn + 1) % this.gameSize;
    const actualPlayer = this.players[playerID];
    const ennemy = this.players[ennemyID];

    const touched = ennemy.hasTouchedABoat(x, y);
    const killedBoat = touched ? ennemy.touchABoat(x, y) : false;
    const lastBoatTouched = ennemy.lastBoatTouched;

    if (ennemy.isDead()) {
      actualPlayer.socket.emit(SOCKET_EVENTS.WIN);
      ennemy.socket.emit(SOCKET_EVENTS.LOOSE);
      this.endGame();
    } else {
      actualPlayer.socket.emit(SOCKET_EVENTS.NEW_MARKER, {x, y, touched, killed: killedBoat, lastBoatTouched});
      ennemy.socket.emit(SOCKET_EVENTS.BOARD_HITED, {x, y, touched, killed: killedBoat, lastBoatTouched});

      this.nextTurn();
    }
  }

  clearListeners() {
    clearTimeout(this.timeOutCallBack);
    this.players.forEach((player) => {
      player.socket.removeAllListeners(SOCKET_EVENTS.NEW_MARKER);
    });
  }

  endGameWithError(msg) {
    this.players.forEach((player) => {
      player.socket.emit(SOCKET_EVENTS.GAME_END_WITH_ERROR, msg);
    });

    this.clearListeners();

    this.onEndWithError(msg);
  }

  endGame() {
    this.clearListeners();

    this.onEnd();
  }

  nextTurn() {
    clearTimeout(this.timeOutCallBack);
    this.turn++;

    const playerID = this.turn % this.gameSize;

    this.players.forEach((player, index) => {
      if (index === playerID) {
        player.socket.emit(SOCKET_EVENTS.PLAYER_TURN);
      } else {
        player.socket.emit(SOCKET_EVENTS.PLAYER_END_TURN);
      }
    });
    setTimeout(this.timeOutCallBack, 30000);
  }

  isGameFull() {
    return this.players.length >= this.gameSize;
  }

  canJoin() {
    return this.players.length < this.gameSize && !this.isStart;
  }

  isEmpty() {
    return this.players.length === 0;
  }

  addPlayer(pseudo, socket) {
    this.players.push(new Player(pseudo, socket));
  }

  removePlayer(socket) {
    this.players = this.players.filter((p) => p.socket.id !== socket.id);
  }
};
