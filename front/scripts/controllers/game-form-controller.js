module.exports = class GameFormController {
  constructor() {
    this.onJoin = (pseudo, id) => {};
    this.onCreate = (pseudo, type) => {};
    this.onReplay = (pseudo) => {};

    this._form = document.getElementById('form');
    this._createPseudoInput = document.getElementById('create_pseudo');
    this._gameTypeInput = document.getElementById('game_type');
    this._createButton = document.getElementById('create_button');
    this._joinPseudoInput = document.getElementById('join_pseudo');
    this._gameIDInput = document.getElementById('game_id');
    this._joinButton = document.getElementById('join_button');
    this._gameCodeDiv = document.getElementById('game_code');
    this._endGameDiv = document.getElementById('end-game');
    this._endGameTitle = document.getElementById('end-game-title');
    this._endGameReplayButton = document.getElementById('replay_button');
    this._endGameQuitButton = document.getElementById('quit_button');
    this._boatCannotTouch = document.getElementById('boat-cannot-touch');
    this._boardSizeInput = document.getElementById('board-size');

    this._endGameReplayButton.onclick = () => {
      const pseudo = localStorage.getItem('pseudo');
      this._endGameReplayButton.disabled = true;
      this._endGameQuitButton.disabled = true;

      this.onReplay(pseudo);
    };

    this._endGameQuitButton.onclick = () => {
      this.hideEndGameForm();
      this.showForm();
    };

    this._createButton.onclick = () => {
      const pseudo = this._createPseudoInput.value;
      const boardSize = this._boardSizeInput.value;
      const boatCannotTouch = this._boatCannotTouch.checked;
      const boatCount = type.split('-').length - 1;
      const boardMinSize = boatCannotTouch ? boatCount * 2 : boatCount;

      let type = this._gameTypeInput.value;


      if (type === '' || pseudo === '') {
        alert('Please fill pseudo and type inputs');
        return;
      }

      if (boardSize < boardMinSize) {
        alert(`The board is to small, it must be at last ${boardMinSize}x${boardMinSize}`)
      }

      type = `${type}-${boatCannotTouch}-${boardSize}`;

      localStorage.setItem('pseudo', pseudo);

      this.onCreate(pseudo, type);
    };

    this._joinButton.onclick = () => {
      const pseudo = this._joinPseudoInput.value;
      const id = this._gameIDInput.value;

      if (id === '' || pseudo === '') {
        alert('Please fill pseudo and game id inputs');
        return;
      }

      localStorage.setItem('pseudo', pseudo);

      this.onJoin(pseudo, id);
    };

    this.readLocalStorage();
  }

  readLocalStorage() {
    const pseudo = localStorage.getItem('pseudo');

    if (pseudo !== undefined) {
      this._createPseudoInput.value = pseudo;
      this._joinPseudoInput.value = pseudo;
    }
  }

  showGameCode(code) {
    this.hideForm();
    this._gameCodeDiv.innerHTML = `<b>Game code</b>: ${code}`;
    this.showCodeDiv();
  }

  hideEndGameForm() {
    this._endGameDiv.style.display = 'none';
  }

  showEndGameForm(title) {
    this._endGameReplayButton.disabled = false;
    this._endGameQuitButton.disabled = false;

    this._endGameTitle.innerText = title;
    this._endGameDiv.style.display = 'block';
  }

  hideForm() {
    this._form.style.display = 'none';
  }

  hideCodeDiv() {
    this._gameCodeDiv.style.display = 'none';
  }

  showCodeDiv() {
    this._gameCodeDiv.style.display = 'inline-block';
  }

  showForm() {
    this._form.style.display = 'block';
  }

  hideAllForm() {
    this.hideForm();
    this.hideCodeDiv();
    this.hideEndGameForm();
  }
};
