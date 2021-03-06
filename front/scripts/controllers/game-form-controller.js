const MessageView = require('../views/message-view');

module.exports = class GameFormController {
  constructor() {
    this.onJoin = (pseudo, id) => {};
    this.onCreate = (pseudo, type) => {};
    this.onReplay = (pseudo) => {};

    this._form = document.getElementById('game-form');
    this._createPseudoInput = document.getElementById('create_pseudo');
    this._gameTypeInput = document.getElementById('game_type');
    this._gameBoatsInput = document.getElementById('game_boats');
    this._createButton = document.getElementById('create_button');
    this._endGameDiv = document.getElementById('end-game');
    this._endGameTitle = document.getElementById('end-game-title');
    this._endGameReplayButton = document.getElementById('replay_button');
    this._endGameQuitButton = document.getElementById('quit_button');
    this._boatCannotTouch = document.getElementById('boat-cannot-touch');
    this._boardSizeInput = document.getElementById('board-size');
    this._gameList = document.getElementById('game-list');
    this._gameCodeDiv = document.getElementById('game_code');

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
      const boats = this._gameBoatsInput.value;

      const boatCannotTouch = this._boatCannotTouch.checked;
      let type = this._gameTypeInput.value;

      if (type === '' || pseudo === '' || boats === '') {
        const message = new MessageView('Please fill pseudo and type inputs', 'Error');
        message.show();

        return;
      }

      type = `${type}-${boats}-${boatCannotTouch}-${boardSize}`;

      localStorage.setItem('pseudo', pseudo);

      this.onCreate(pseudo, type);
    };

    this.readLocalStorage();
  }

  readLocalStorage() {
    const pseudo = localStorage.getItem('pseudo');

    if (pseudo !== undefined) {
      this._createPseudoInput.value = pseudo;
    }
  }

  setGameList(games) {
    this._gameList.innerHTML = '';
    games.forEach((game) => {
      const item = document.createElement('li');
      item.innerHTML = `<b>${game.host}</b> <i>#${game.code}</i> <button class="join-button">Join</button>`;
      item.className = 'list-group-item';

      item.addEventListener('click', () => {
        this.onJoin(this.getPseudo(), game.code);
      });

      this._gameList.appendChild(item);
    });
  }

  getPseudo() {
    return this._createPseudoInput.value;
  }

  showGameCode(code) {
    this.showInfoMessage(`<b>Game code</b>: ${code}`);
  }

  showInfoMessage(msg) {
    this.hideForm();
    this._gameCodeDiv.innerHTML = msg;
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

  showGameErrorMsg(msg) {
    const message = new MessageView(msg, 'Error');
    message.show();

    this.hideAllForm();
    this.showForm();
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
