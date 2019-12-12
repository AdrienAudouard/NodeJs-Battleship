const randomString = require('../utils/random-string');

module.exports = class Game {
  constructor(pseudo, type, socket) {
    this.code = randomString(6);
    this.boats = type.split('-').slice(1);
    this.players = [{pseudo, socket}];
    this.gameSize = type.split('-')[0];
  }

  start() {
    this.players.forEach((player) => {
      player.socket.emit('game_start');
    })
  }

  isGameFull() {
    return this.players.length >= this.gameSize;
  }

  addPlayer(pseudo, socket) {
    this.players.push({ pseudo, socket });
  }
};
