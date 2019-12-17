const BoardGenerator = require('../utils/board-generator');
const randomString = require('../utils/random-string');

module.exports = class Playable {
  constructor(pseudo) {
    this.pseudo = pseudo;
    this.board = [];
    this.lastBoatTouched = -1;
    this.onNewMarker = (x, y) => {};
    this.id = randomString(10);
  }

  getLastKilledBoat() {
    if (this.lastBoatTouched === -1) { return null; }
    return this.board[this.lastBoatTouched];
  }

  isDead() {
    for(let i = 0; i < this.board.length; i++) {
      const points = this.board[i].points;

      for(let j = 0; j < points.length; j++) {
        if (!points[j].hited) {
          return false;
        }
      }
    }

    return true;
  }

  generateBoard(boats, boatCannotTouch, boardSize = 10) {
    const boardGenerator = new BoardGenerator();
    this.board = boardGenerator.generateBoard(boats, boatCannotTouch, boardSize);
  }

  touchABoat(x, y) {
    const boat = this.board.filter((boat, index) => {
      for(let j = 0; j < boat.points.length; j++) {
        const point = boat.points[j];
        if (point.x === x && point.y === y) {
          this.lastBoatTouched = index;
          return true;
        }
      }

      return false;
    })[0];

    for(let j = 0; j < boat.points.length; j++) {
      const point = boat.points[j];

      if (point.x === x && point.y === y) {
        boat.points[j].hited = true;
      }
    }

    const hitedPointsCount = boat.points.filter((p) => p.hited).length;

    return hitedPointsCount === boat.points.length
  }

  hasTouchedABoat(x, y) {
    for(let i = 0; i < this.board.length; i++) {
      const boat = this.board[i];

      for(let j = 0; j < boat.points.length; j++) {
        const point = boat.points[j];
        if (point.x === x && point.y === y) {
          return true;
        }
      }
    }

    return false;
  }

  startLoading() {}

  startGame(boardSize) {}

  boardHitted(x, y, touched, killedBoat, lastBoatTouched, boatCannotTouch, lastBoatKilledPoints) {}

  newMarker(x, y, touched, killedBoat, lastBoatTouched, boatCannotTouch, lastBoatKilledPoints) {}

  loose() {}

  win() {}

  play() {}

  endTurn() {}

  clearListeners() {}

  endGameWithError(msg) {}
};
