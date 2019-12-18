const Playable = require('./playable');
const randomInt = require('../utils/random-int');
const AI_MODE = require('./ai-mode');

module.exports = class AiPlayer extends Playable {
  constructor() {
    super('AI');

    this.targets = [];
    this.mode = AI_MODE.HUNT;
    this.potentialsTargets = [];
    this.hittedButNotKilled = [];
  }

  startGame(boardSize) {
    super.startGame(boardSize);

    for(let i = 0; i < boardSize; i++) {
      for(let j = 0; j < boardSize; j++) {
        this.targets.push({x: i, y: j});
      }
    }
  }

  canTargetsThisPoint(x, y) {
    return this.targets.filter((t) => t.x === x && t.y === y).length !== 0;
  }

  newMarker(x, y, touched, killedBoat, lastBoatTouched, boatCannotTouch, lastBoatKilledPoints) {
    super.newMarker(x, y, touched, killedBoat, lastBoatTouched, boatCannotTouch, lastBoatKilledPoints);

    if (lastBoatKilledPoints) {
      this.updateTargets(lastBoatKilledPoints, boatCannotTouch);
    } else if(touched) {
      this.hittedButNotKilled.push({x, y});
    }

    if (touched) {
      this.mode = AI_MODE.TARGET;
      this.potentialsTargets = this.potentialsTargets.concat(this.determinatePotentialsTargets(x, y));

      if (this.potentialsTargets.length === 0) {
        this.mode = AI_MODE.HUNT;
      }
    } else if (this.potentialsTargets.length === 0) {
      this.mode = AI_MODE.HUNT;
    }
  }

  updateTargets(lastBoatKilledPoints, boatCannotTouch) {
    this.updateHiitedButNotKilled(lastBoatKilledPoints);
    if (boatCannotTouch) {
      this.filterTargetsWithKilledBoat(lastBoatKilledPoints);
    }
  }

  updateHiitedButNotKilled(lastBoatKilledPoints) {
    lastBoatKilledPoints.forEach((p) => {
      this.hittedButNotKilled = this.hittedButNotKilled.filter((el) => p.x !== el.x || p.y !== el.y);
    });
  }

  filterTargetsWithKilledBoat(killedBoat) {
    killedBoat.forEach((p) => {
      const points = [
        { x: p.x + 1, y: p.y  },
        { x: p.x - 1, y: p.y  },
        { x: p.x, y: p.y + 1  },
        { x: p.x, y: p.y - 1 },
      ];

      const filterCallback = (t) => {
        return points.filter((point) => point.x === t.x && point.y === t.y).length === 0;
      };

      this.targets = this.targets.filter(filterCallback);

      this.potentialsTargets = this.potentialsTargets.filter(filterCallback);
    });
  }

  determinatePotentialsTargets(x, y) {
    const potentielsFutureTargets = [
      { x: x + 1, y: y },
      { x: x - 1, y: y },
      { x: x, y: y - 1},
      { x: x, y: y + 1}
    ];

    const potentials = [];

    potentielsFutureTargets.forEach((p) => {
      if (this.canTargetsThisPoint(p.x, p.y)) {
        potentials.push(p);
      }
    });

    return potentials;
  }

  play() {
    super.play();
    let target;

    if (this.mode === AI_MODE.HUNT) {
      target = this._huntPlay();
    } else {
      target = this._targetPlay();
    }

    this.targets = this.targets.filter((t) => t.x !== target.x || t.y !== target.y);

    setTimeout(() => {
      this.onNewMarker(target.x, target.y);
    }, 200);
  }

  _huntPlay() {
    const index = randomInt(this.targets.length);
    return this.targets[index];
  }

  _targetPlay() {
    let target = null;

    const shouldPreferHorizontal = this._shouldPreferHorizontal();
    const shouldPreferVertical = this._shouldPreferVertical();

    if (shouldPreferHorizontal) {
      target = this.potentialsTargets.filter((el) => el.y === shouldPreferHorizontal)[0];
    } else if (shouldPreferVertical) {
      target = this.potentialsTargets.filter((el) => el.x === shouldPreferVertical)[0];
    }

    if (target === null || target === undefined) {
      const index = randomInt(this.potentialsTargets.length);
      target = this.potentialsTargets[index];
    }

    this.potentialsTargets = this.potentialsTargets.filter((t) => t.x !== target.x || t.y !== target.y);

    return target;
  }

  _shouldPreferHorizontal() {
    const sortedHitted = this.hittedButNotKilled.sort((o1, o2) => o1.y - o2.y);

    for(let i = 0; i < sortedHitted.length - 1; i++) {
      if (sortedHitted[i].y === sortedHitted[i+ 1].y) {
        return sortedHitted[i].y;
      }
    }

    return null;
  }

  _shouldPreferVertical() {
    const sortedHitted = this.hittedButNotKilled.sort((o1, o2) => o1.x - o2.x);

    for(let i = 0; i < sortedHitted.length - 1; i++) {
      if (sortedHitted[i].x === sortedHitted[i+ 1].x) {
        return sortedHitted[i].x;
      }
    }

    return null;
  }
};
