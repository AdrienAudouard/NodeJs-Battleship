const Game = require('./models/game');
const Player = require('./models/player');
const AIPlayer = require('./models/ai-player');

module.exports = class GameController {
  constructor() {
    this.games = {};
    this.oldGamesType = {};
  }

  createGame(pseudo, type, socket) {
    const newGame = new Game(pseudo, type, socket);
    const code = newGame.code;

    this.games[code] = newGame;
    if (this.games[code].isAIGame()) {
      newGame.addPlayer(new AIPlayer());

      this.startGame(code);
    }

    return code;
  }

  joinGame(pseudo, socket, id) {
    this.games[id].addPlayer(new Player(pseudo, socket));
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

  getNotFullGames() {
    const games = [];
    for(let[key, value] of Object.entries(this.games)) {
      if (!value.canJoin()) {
        continue;
      }

      games.push({
        code: key,
        host: value.players[0].pseudo
      });
    }

    return games;
  }

  isGameStarted(code) {
    return this.games[code].isStart;
  }

  removePlayerFromGame(code, socket) {
    this.games[code].removePlayer(socket);

    if (this.games[code].isEmpty()) {
      delete this.games[code];
      return true;
    }

    return false;
  }

  endGameWithError(code) {
    const game = this.games[code];
    if (game) {
      game.endGameWithError('A player has left the game');
    }

    delete this.games[code];
  }

  startGame(code) {
    this.games[code].start();
    this.games[code].onEnd = () => {
      this.oldGamesType[code] = this.games[code].type;
      delete this.games[code];
    };

    this.games[code].onEndWithError = (err) => {
      delete this.games[code];
    };
  }
};
