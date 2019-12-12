const Marker = require('../model/marker');

module.exports = class GameController {
  constructor(view, socketController) {
    this.gameView = view;
    this.socketController = socketController;

    this.gameView.onClick = (x, y) => {
      this.socketController.addNewMarker(x, y);
    };

    this.socketController.onNewMarker = (x, y) => { this.onNewMarker(x, y); }
  }

  onNewMarker(x, y) {
    this.gameView.addMarker(new Marker(x, y));
    this.gameView.draw();
  }
};
