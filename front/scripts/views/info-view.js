module.exports = class InfoView {
  constructor(ctx, h) {
    this.div = document.getElementById('info-view');
  }

  clear() {
    window.clearTimeout(this.timeOut);
    this.div.innerText = '';
  }

  drawInfo(txt) {
    window.clearTimeout(this.timeOut);
    this._drawInfo(txt, 30);
  }

  _drawInfo(txt, count) {
    window.clearTimeout(this.timeOut);

    this.div.innerText = `${txt}... ${count} seconds remaining`;

    this.timeOut = window.setTimeout(() => {
      const nextCount = count - 1;
      this._drawInfo(txt, nextCount);
    }, 1000)
  }
};
