const Colors = require('../config/colors');
const AssetsLoader = require('../utils/assets-loader');

module.exports = class GameView {
  constructor(ctx, w, h, x, y) {
    this._ctx = ctx;
    this._width = w;
    this._heigth = h;
    this._x = x;
    this._y = y;

    this.markers = [];

    this.draw();
    this.onClick = (x, y) => {};

    window.addEventListener('click', (evt) => {
      this._onClick(evt);
    });
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

    const gridX = Math.trunc(x / this._width * 10);
    const gridY = Math.trunc(y / this._heigth * 10);

    this.onClick(gridX, gridY);
  }

  draw() {
    this._ctx.save();

    this._ctx.translate(this._x, this._y);
    this._ctx.clearRect(0, 0, this._width, this._heigth);

    this._drawBackground();
    this._drawLines();
    this._drawMarkers();

    this._ctx.restore();
  }

  _drawMarkers() {
    this.markers.forEach((m) => {
      const size = this._width / 10 * 0.7;

      const x = m.x * (this._width / 10) + (this._width / 10 * 0.3 / 2);
      const y = m.y * (this._heigth / 10) + (this._width / 10 * 0.3 / 2);

      this._ctx.drawImage(AssetsLoader.get('ship'), x, y, size, size);
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

    for (let i = 1; i < 10; i++) {
      const x = i * (this._width / 10);
      const y = i * (this._heigth / 10);

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
};
