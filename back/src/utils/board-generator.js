const randomInt = require('./random-int');

module.exports = class BoardGenerator {
  indexOfStartPoint(point, startPoints) {
    for (let i = 0; i < startPoints.length; i++) {
      if (startPoints[i].x === point.x && startPoints[i].y === point.y) {
        return i;
      }
    }

    return 0;
  };

  generateBoat(boatSize, boardSize, boatCantTouch, possibilities) {
    if (possibilities.startPoints.length === 0) {
      return undefined;
    }

    const index = randomInt(possibilities.startPoints.length);
    const startPoint = possibilities.startPoints[index];

    const isHorizontal =
      startPoint.canBeVertical && startPoint.canBeHorizontal
        ? randomInt(2) === 1
        : !startPoint.canBeVertical;

    const points = [];

    for (let i = 0; i < boatSize; i++) {
      const x = isHorizontal ? startPoint.x + i : startPoint.x;
      const y = isHorizontal ? startPoint.y : startPoint.y + i;

      points.push({ x, y, hited: false });
    }

    return {
      points,
      size: boatSize,
      isHorizontal
    };
  };

  generateExcludedPossibilities(board , boatCantTouch) {
    const excluded = [];
    board.forEach(b => {
      b.points.forEach(p => {
        excluded.push({ x: p.x, y: p.y });
        if (boatCantTouch) {
          excluded.push({ x: p.x + 1, y: p.y });
          excluded.push({ x: p.x - 1, y: p.y });
          excluded.push({ x: p.x, y: p.y + 1 });
          excluded.push({ x: p.x, y: p.y - 1 });
        }
      });
    });

    return excluded;
  };

  excludedContaines(point, excluded) {
    return (
      excluded.filter(el => el.x === point.x && el.y === point.y).length !== 0
    );
  };

  canBeAHorizontalStartPoint(point, boat, boardSize, excluded) {
    for (let i = 0; i < boat; i++) {
      const tempPoint = {
        x: point.x + i,
        y: point.y
      };

      if (this.excludedContaines(tempPoint, excluded) || tempPoint.x >= boardSize) {
        return false;
      }
    }

    return true;
  };

  canBeAVerticalStartPoint(point, boat, boardSize, excluded) {
    for (let i = 0; i < boat; i++) {
      const tempPoint = {
        x: point.x,
        y: point.y + i
      };

      if (this.excludedContaines(tempPoint, excluded) || tempPoint.y >= boardSize) {
        return false;
      }
    }

    return true;
  };

  generatePossibilities(boat, boardSize, boatCantTouch, board) {
    const excluded = this.generateExcludedPossibilities(
      board,
      boatCantTouch
    );
    const startPoints = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        const point = { x: i, y: j };

        if (this.excludedContaines(point, excluded)) {
          excluded.push(point);
          continue;
        }

        const canBeVertical = this.canBeAVerticalStartPoint(
          point,
          boat,
          boardSize,
          excluded
        );
        const canBeHorizontal = this.canBeAHorizontalStartPoint(
          point,
          boat,
          boardSize,
          excluded
        );

        if (canBeHorizontal || canBeVertical) {
          startPoints.push({
            x: i,
            y: j,
            canBeHorizontal,
            canBeVertical
          });
        } else {
          excluded.push(point);
        }
      }
    }

    return { startPoints, excluded };
  };

  generateBoard(boats = [], boatCantTouch, boardSize) {
    const possibilities = [];
    let board = [];
    let i = 0;

    while (i < boats.length) {
      const boat = boats[i];
      if (possibilities[i] === undefined) {
        possibilities[i] = this.generatePossibilities(
          boat,
          boardSize,
          boatCantTouch,
          board
        );
      }

      if (i === 0 && possibilities[i].startPoints.length === 0) {
        throw new Error('cannot generate board');
      }

      const futureBoat = this.generateBoat(
        boat,
        boardSize,
        boatCantTouch,
        possibilities[i]
      );

      if (futureBoat === undefined) {
        delete possibilities[i];

        i--;

        const previousBoat = board[i];
        const indxOfStartPoint = this.indexOfStartPoint(
          previousBoat.points[0],
          possibilities[i].startPoints
        );
        const startPoint = possibilities[i].startPoints[indxOfStartPoint];

        if (previousBoat.isHorizontal) {
          startPoint.canBeHorizontal = false;
        } else {
          startPoint.canBeVertical = false;
        }

        if (startPoint.canBeHorizontal || startPoint.canBeVertical) {
          possibilities[i].startPoints[indxOfStartPoint] = startPoint;
        } else {
          possibilities[i].startPoints = possibilities[i].startPoints.filter(
            (el, index) => index !== indxOfStartPoint
          );
          possibilities[i].excluded.push({ x: startPoint.x, y: startPoint.y });
        }

        board = board.slice(0, i);
      } else {
        i++;
        board.push(futureBoat);
      }
    }

    return board;
  };
};
