const randomString = require('../utils/random-string');
const Player = require('./player');

module.exports = class Game {
  constructor(pseudo, type, socket) {
    this.code = randomString(6);
    this.type = type;

    const splitedType = type.split('-');

    this.boats = splitedType.slice(1, splitedType.length - 2);
    this.boatCannotTouch = splitedType[splitedType.length - 2] === 'true';
    this.boardSize = parseInt(splitedType[splitedType.length - 1]);
    this.players = [new Player(pseudo, socket)];
    this.gameSize = type.split('-')[0];
    this.turn = 0;
    this.onEnd = () => {};
  }

  start() {
    this.players.forEach((player) => {
      player.generateBoard(this.boats, this.boatCannotTouch, this.boardSize);
      player.socket.emit('game_start', {board: player.board, boardSize: this.boardSize});

      player.socket.on('new_marker', ({x, y}) => {
        this.onNewMarker(x, y);
      });
    });

    this.nextTurn();
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
      actualPlayer.socket.emit('win');
      ennemy.socket.emit('loose');
      this.endGame();
    } else {
      actualPlayer.socket.emit('new_marker', {x, y, touched, killed: killedBoat, lastBoatTouched});
      ennemy.socket.emit('board_hited', {x, y, touched, killed: killedBoat, lastBoatTouched});

      this.nextTurn();
    }
  }

  endGame() {
    this.players.forEach((player) => {
      player.socket.removeAllListeners('new_marker');
    });

    this.onEnd();
  }

  nextTurn() {
    this.turn ++;

    const playerID = this.turn % this.gameSize;

    this.players.forEach((player, index) => {
      if (index === playerID) {
        player.socket.emit('player_turn');
      } else {
        player.socket.emit('player_end_turn');
      }
    });
  }

  isGameFull() {
    return this.players.length >= this.gameSize;
  }

  canJoin() {
    return this.players.length < this.gameSize;
  }

  addPlayer(pseudo, socket) {
    this.players.push(new Player(pseudo, socket));
  }
};
