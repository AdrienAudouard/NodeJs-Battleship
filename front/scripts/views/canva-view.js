module.exports = class CanvasView {
  constructor() {
    this._canvas = document.getElementById('paper');
    this.ctx = this._canvas.getContext("2d");

    window.onresize = () => {
      this._initCanvasSize();
    };

    this._initCanvasSize();
  }

  _initCanvasSize() {
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }
};
