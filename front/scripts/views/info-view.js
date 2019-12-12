module.exports = class InfoView {
  constructor(ctx, h) {
    this._ctx = ctx;
    this._h = h;
  }

  drawInfo(txt) {
    this._ctx.save();
    this._ctx.clearRect(0, 0, window.innerWidth, this._h);
    this._ctx.textAlign = "center";
    this._ctx.fillStyle = "white";
    this._ctx.font = "30px Arial";
    this._ctx.fillText(txt, window.innerWidth / 2, this._h / 2);
    this._ctx.restore();
  }
};
