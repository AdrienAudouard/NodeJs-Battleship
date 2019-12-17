const Playable = require('./playable');
const randomInt = require('../utils/random-int');
const AI_MODE = require('./ai-mode');

module.exports = class AiPlayer extends Playable {
  constructor() {
    super('AI');

    this.targets = [];
    this.mode = AI_MODE.HUNT;
    this.potentialsTargets = [];

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

    if (lastBoatKilledPoints && boatCannotTouch) {
      this.filterTargetsWithKilledBoat(lastBoatKilledPoints);
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
    const index = randomInt(this.potentialsTargets.length);
    const target = this.potentialsTargets[index];

    this.potentialsTargets = this.potentialsTargets.filter((t) => t.x !== target.x || t.y !== target.y);

    return target;
  }
};
