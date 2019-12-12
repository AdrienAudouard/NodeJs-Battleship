const randomInt = require('../utils/random-int');

module.exports = class Player {
  constructor(pseudo, socket) {
    this.pseudo = pseudo;
    this.socket = socket;
    this.board = [];
    this.lastBoatTouched = -1;
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

  generateBoard(boats, boardSize = 10) {
    boats.forEach((boat) => {
      let futureBoat = {};

      do {
        const isHorizontal = randomInt(2) === 1;
        const start = {
          x: randomInt(boardSize - boat),
          y: randomInt(boardSize - boat),
        };
        const points = [];

        for (let i = 0; i < boat; i++) {
          const x = isHorizontal ? start.x + i : start.x;
          const y = isHorizontal ? start.y : start.y + i;

          points.push({ x, y, hited: false });
        }

        futureBoat = {points, isHorizontal, size: boat};
      } while (this.intersectAnotherBoat(futureBoat));
      this.board.push(futureBoat);
    });
  }

  intersectAnotherBoat(newBoat) {
    for(let i = 0; i < this.board.length; i++) {
      const boat = this.board[i];
      for(let j = 0; j < boat.points.length; j++) {
        const point = boat.points[j];
        for(let k = 0; k < newBoat.points.length; k++) {
          const newPoint = newBoat.points[k];

          if (newPoint.x === point.x && newPoint.y === point.y) {
            return true;
          }
        }
      }
    }
    return false;
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
};
