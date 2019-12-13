const Game = require('./models/game');

module.exports = class GameController {
  constructor() {
    this.games = {};
    this.oldGamesType = {};
  }

  createGame(pseudo, type, socket) {
    const newGame = new Game(pseudo, type, socket);
    const code = newGame.code;

    this.games[code] = newGame;

    return code;
  }

  joinGame(pseudo, socket, id) {
    this.games[id].addPlayer(pseudo, socket);
  }

  canGameStart(code) {
    return this.games[code].isGameFull();
  }

  gameExists(code) {
    return this.games[code] !== undefined;
  }

  canJoin(code) {
    return this.games[code].canJoin();
  }

  createGameWithCode(code, pseudo, socket) {
    const type = this.oldGamesType[code];
    this.games[code] = new Game(pseudo, type, socket);
  }

  startGame(code) {
    this.games[code].start();
    this.games[code].onEnd = () => {
      this.oldGamesType[code] = this.games[code].type;
      delete this.games[code];
    };
  }
};
