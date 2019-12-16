const AssetsLoader = require('../utils/assets-loader');

module.exports = class GameView {
  constructor(boardSize, container) {
    this._container = container;
    this._boardSize = boardSize;
    this._boardElement = null;
    this._squareElements = [];
    this.markers = [];
    this.boats = [];
    this.onClick = (x, y) => {};

    this.draw();
  }

  addMarker(marker) {
    this.markers.push(marker);
    this.markers.forEach((m) => {
      this._squareElements[m.y][m.x].style.backgroundImage = `url('${AssetsLoader.get(m.type).src}')`;
    });
  }

  _onClick(x, y) {
    for(let i = 0; i < this.markers.length; i++) {
      const m = this.markers[i];
      if (m.x === x && m.y === y) {
        return false;
      }
    }

    this.onClick(x, y);
    return true;
  }

  draw() {
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    const boardContainer = document.getElementsByClassName(this._container)[0];

    const board = document.createElement('div');
    board.className = 'board';

    for(let i = 0; i < this._boardSize; i++) {
      this._squareElements[i] = [];
      const row = document.createElement('div');
      row.className = 'board-row';

      for(let j = 0; j < this._boardSize; j++) {
        const square = this.buildSquare(i, j);
        this._squareElements[i][j] = square;

        row.appendChild(square);
      }

      board.appendChild(row);
    }

    boardContainer.appendChild(board);
    board.style.height = (board.offsetWidth) + 'px';

    window.addEventListener('resize', () => {
      this._boardElement.style.height = (this._boardElement.offsetWidth) + 'px';
    });

    this._boardElement = board;
  }

  buildSquare(i, j) {
    const square = document.createElement('div');
    square.className = 'square';

    square.onclick = () => {
      if (this._onClick(j, i)) {
        square.onclick = null;
      }
    };

    return square;
  }

  onDestroy() {
    const boardContainer = document.getElementsByClassName(this._container)[0];
    boardContainer.removeChild(this._boardElement);
  }
};
