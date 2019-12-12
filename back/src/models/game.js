const randomString = require('../utils/random-string');
const Player = require('./player');

module.exports = class Game {
  constructor(pseudo, type, socket) {
    this.code = randomString(6);
    this.boats = type.split('-').slice(1);
    this.players = [new Player(pseudo, socket)];
    this.gameSize = type.split('-')[0];
    this.turn = 0;
  }

  start() {
    this.players.forEach((player) => {
      player.generateBoard(this.boats);
      player.socket.emit('game_start', player.board);

      player.socket.on('new_marker', ({x, y}) => {
        const playerID = this.turn % this.gameSize;
        const ennemyID = (this.turn + 1) % this.gameSize;

        const touched = this.players[ennemyID].hasTouchedABoat(x, y);
        const killedBoat = touched ? this.players[ennemyID].touchABoat(x, y) : false;

        this.players.forEach((player, index) => {
          if (playerID === index) {
            player.socket.emit('new_marker', {x, y, touched, killed: killedBoat});
          } else {
            player.socket.emit('board_hited', {x, y, touched, killed: killedBoat});
          }
        });

        this.nextTurn();
      });
    });

    this.nextTurn();
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

  addPlayer(pseudo, socket) {
    this.players.push(new Player(pseudo, socket));
  }
};
