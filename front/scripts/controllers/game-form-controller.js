module.exports = class GameFormController {
  constructor() {
    this.onJoin = (pseudo, id) => {};
    this.onCreate = (pseudo, type) => {};

    this._form = document.getElementById('form');
    this._createPseudoInput = document.getElementById('create_pseudo');
    this._gameTypeInput = document.getElementById('game_type');
    this._createButton = document.getElementById('create_button');
    this._joinPseudoInput = document.getElementById('join_pseudo');
    this._gameIDInput = document.getElementById('game_id');
    this._joinButton = document.getElementById('join_button');
    this._gameCodeDiv = document.getElementById('game_code');

    this._createButton.onclick = () => {
      const pseudo = this._createPseudoInput.value;
      const type = this._gameTypeInput.value;

      if (type === '' || pseudo === '') {
        alert('Please fill pseudo and type inputs');
        return;
      }

      this.onCreate(pseudo, type);
    };

    this._joinButton.onclick = () => {
      const pseudo = this._joinPseudoInput.value;
      const id = this._gameIDInput.value;

      if (id === '' || pseudo === '') {
        alert('Please fill pseudo and game id inputs');
        return;
      }

      this.onJoin(pseudo, id);
    }
  }

  showGameCode(code) {
    this.hideForm();
    this._gameCodeDiv.innerHTML = `<b>Game code</b>: ${code}`;
    this.showCodeDiv();
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
    this._form.style.display = 'flex';
  }

  hideAllForm() {
    this.hideForm();
    this.hideCodeDiv();

  }
};
