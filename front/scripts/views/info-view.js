module.exports = class InfoView {
  constructor(ctx, h) {
    this._ctx = ctx;
    this._h = h;
    this.timeOut = () => {};
  }

  drawInfo(txt) {
    window.clearTimeout(this.timeOut);
    this._drawInfo(txt, 30);
  }

  _drawInfo(txt, count) {
    window.clearTimeout(this.timeOut);

    this._ctx.save();
    this._ctx.clearRect(0, 0, window.innerWidth, this._h);
    this._ctx.textAlign = "center";
    this._ctx.fillStyle = "white";
    this._ctx.font = "30px Arial";
    this._ctx.fillText(`${txt}... ${count} seconds remaining`, window.innerWidth / 2, this._h / 2);
    this._ctx.restore();

    this.timeOut = () => {
      const nextCount = count - 1;
      this._drawInfo(txt, nextCount);
    };

    window.setTimeout(this.timeOut, 1000)
  }
};
