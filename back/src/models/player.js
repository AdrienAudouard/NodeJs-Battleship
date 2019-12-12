const randomInt = require('../utils/random-int');

module.exports = class Player {
  constructor(pseudo, socket) {
    this.pseudo = pseudo;
    this.socket = socket;
    this.board = [];
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

        let end = {};

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

  intersectAnotherBoat(boat) {
    for(let i = 0; i < this.board.length; i++) {
      const x1 = boat.points[0].x;
      const y1 = boat.points[0].y;
      const x2 = boat.points[boat.points.length - 1].x;
      const y2 = boat.points[boat.points.length - 1].y;

      const x3 = this.board[i].points[0].x;
      const y3 = this.board[i].points[0].y;
      const x4 = this.board[i].points[this.board[i].points.length - 1].x;
      const y4 = this.board[i].points[this.board[i].points.length - 1].y;

      if (this.segment_intersection(x1, y1, x2, y2, x3, y3, x4, y4)) {
        return true;
      }
    }

    return false;
  }

  touchABoat(x, y) {
    const boat = this.board.filter((boat) => {
      for(let j = 0; j < boat.points.length; j++) {
        const point = boat.points[j];
        if (point.x === x && point.y === y) {
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

  between(a, b, c) {
    return a <= b && b <= c;
  }

  // From: https://gist.github.com/gordonwoodhull/50eb65d2f048789f9558
  segment_intersection(x1,y1,x2,y2, x3,y3,x4,y4) {
    const x=((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4)) /
      ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    const y=((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4)) /
      ((x1-x2)*(y3-y4)-(y1-y2)*(x3-x4));
    if (isNaN(x)||isNaN(y)) {
      return false;
    } else {
      if (x1>=x2) {
        if (!this.between(x2, x, x1)) {return false;}
      } else {
        if (!this.between(x1, x, x2)) {return false;}
      }
      if (y1>=y2) {
        if (!this.between(y2, y, y1)) {return false;}
      } else {
        if (!this.between(y1, y, y2)) {return false;}
      }
      if (x3>=x4) {
        if (!this.between(x4, x, x3)) {return false;}
      } else {
        if (!this.between(x3, x, x4)) {return false;}
      }
      if (y3>=y4) {
        if (!this.between(y4, y, y3)) {return false;}
      } else {
        if (!this.between(y3, y, y4)) {return false;}
      }
    }
    return {x: x, y: y};
  }
};
