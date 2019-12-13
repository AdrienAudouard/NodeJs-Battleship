const Colors = require('../config/colors');
const AssetsLoader = require('../utils/assets-loader');
const MARKER_TYPE = require('../model/marker-type');

module.exports = class GameView {
  constructor(ctx, w, h, x, y, boardSize) {
    this._ctx = ctx;
    this._width = w;
    this._heigth = h;
    this._x = x;
    this._y = y;
    this._boardSize = boardSize;

    this.markers = [];
    this.boats = [];
    this.draw();
    this.onClick = (x, y) => {};

    this._onClickListener = (evt) => {
      this._onClick(evt);
    };

    window.addEventListener('click', this._onClickListener);
  }

  addMarker(marker) {
    this.markers.push(marker);
  }

  _onClick(evt) {
    const x = evt.clientX - (window.innerWidth / 2 - this._width / 2);
    const y = evt.clientY - (window.innerHeight / 2 - this._heigth / 2);

    if (x < 0 || y < 0 || x > this._width || y > this._heigth) {
      return;
    }

    const gridX = Math.trunc(x / this._width * this._boardSize);
    const gridY = Math.trunc(y / this._heigth * this._boardSize);

    for(let i = 0; i < this.markers.length; i++) {
      const m = this.markers[i];
      if (m.x === gridX && m.y === gridY) {
        return;
      }
    }

    this.onClick(gridX, gridY);
  }

  draw() {
    this._ctx.save();

    this._ctx.translate(this._x, this._y);
    this._ctx.clearRect(0, 0, this._width, this._heigth);

    this._drawBackground();
    this._drawLines();
    this._drawBoats();
    this._drawMarkers();


    this._ctx.restore();
  }

  _drawBoats() {
    this.boats.forEach((boat) => {
      const image = AssetsLoader.get(MARKER_TYPE.PLAYER_BOAT);
      const size = this._width / this._boardSize;

      boat.points.forEach((point) => {
        this._ctx.drawImage(image, point.x * size, point.y * size, size, size);
      });
    });

  }

  _drawMarkers() {
    this.markers.forEach((m) => {
      const size = this._width / this._boardSize * 0.7;

      const x = m.x * (this._width / this._boardSize) + (this._width / this._boardSize * 0.3 / 2);
      const y = m.y * (this._heigth / this._boardSize) + (this._width / this._boardSize * 0.3 / 2);

      this._ctx.drawImage(AssetsLoader.get(m.type), x, y, size, size);
    });
  }

  _drawBackground() {
    this._ctx.beginPath();
    this._ctx.fillStyle = Colors.GAME_VIEW_BACKGROUND;
    this._ctx.rect(0, 0, this._width, this._heigth);
    this._ctx.fill();
  }

  _drawLines() {
    this._ctx.strokeStyle = Colors.GAME_VIEW_LINE;

    for (let i = 1; i < this._boardSize; i++) {
      const x = i * (this._width / this._boardSize);
      const y = i * (this._heigth / this._boardSize);

      // Draw vertical lines
      this._ctx.beginPath();
      this._ctx.moveTo(x, 0);
      this._ctx.lineTo(x, this._heigth);
      this._ctx.stroke();

      // // Draw horizontal lines
      this._ctx.beginPath();
      this._ctx.moveTo(0, y);
      this._ctx.lineTo(this._width, y);
      this._ctx.stroke();
    }
  }

  onDestroy() {
    window.removeEventListener('click', this._onClickListener);
  }
};
