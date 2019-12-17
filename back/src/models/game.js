const randomString = require('../utils/random-string');
const Player = require('./player');

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
    this.gameSize = parseInt(type.split('-')[0]);
    this.turn = 0;
    this.onEnd = () => {
    };
    this.onEndWithError = (msg) => {
    };

    this.timeOutRef = null;
  }

  isAIGame() {
    return this.gameSize === 1;
  }

  start() {
    if (this.isAIGame()) {
      this.gameSize += 1;
    }

    this.players.forEach((player) => {
      player.startLoading();
    });

    setImmediate(() => {
      try {
        this.isStart = true;
        this.players.forEach((player) => {
          player.generateBoard(this.boats, this.boatCannotTouch, this.boardSize);
          player.startGame(this.boardSize);

          player.onNewMarker = (x, y) => {

            this.onNewMarker(x, y);
          };
        });

        this.nextTurn();
      } catch (e) {
        console.error(e.message);
        this.endGameWithError('The board cannot be generated, please retry with an other game type.');
      }
    });
  }

  onNewMarker(x, y) {
    const playerID = this.turn % this.players.length;
    const ennemyID = (this.turn + 1) % this.players.length;

    const actualPlayer = this.players[playerID];
    const ennemy = this.players[ennemyID];

    const touched = ennemy.hasTouchedABoat(x, y);
    const killedBoat = touched ? ennemy.touchABoat(x, y) : false;
    const lastBoatTouched = ennemy.lastBoatTouched;
    const lastBoatKilledPoints = killedBoat ? ennemy.getLastKilledBoat().points : null;

    if (ennemy.isDead()) {
      actualPlayer.win();
      ennemy.loose();
      this.endGame();
    } else {
      actualPlayer.newMarker(x, y, touched, killedBoat, lastBoatTouched, this.boatCannotTouch,lastBoatKilledPoints);
      ennemy.boardHitted(x, y, touched, killedBoat, lastBoatTouched, this.boatCannotTouch, lastBoatKilledPoints);

      this.nextTurn();
    }
  }

  clearListeners() {
    clearTimeout(this.timeOutRef);
    this.players.forEach((player) => {
      player.clearListeners();
    });
  }

  endGameWithError(msg) {
    this.players.forEach((player) => {
      player.endGameWithError(msg);
    });

    this.clearListeners();

    this.onEndWithError(msg);
  }

  endGame() {
    this.clearListeners();

    this.onEnd();
  }

  nextTurn() {
    clearTimeout(this.timeOutRef);
    this.turn++;

    const playerID = this.turn % this.players.length;

    this.players.forEach((player, index) => {
      if (index === playerID) {
        player.play();
      } else {
        player.endTurn();
      }
    });

    this.timeOutRef = setTimeout(() => {
      this.nextTurn();
    }, 30000);
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

  addPlayer(player) {
    this.players.push(player);
  }

  removePlayer(socket) {
    this.players = this.players.filter((p) => p.socket.id !== socket.id);
  }
};
