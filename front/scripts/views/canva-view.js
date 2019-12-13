module.exports = class CanvasView {
  constructor() {
    this._canvas = document.getElementById('paper');
    this.ctx = this._canvas.getContext("2d");

    this._initCanvasSize();
  }

  clear() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  _initCanvasSize() {
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }
};
