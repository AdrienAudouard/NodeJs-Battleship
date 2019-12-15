module.exports = class MessageView {
  constructor(message, title = 'New message') {
    const messageView = document.getElementById('alert-template');
    this.clonedMessageView = messageView.cloneNode(true);
    this.clonedMessageView.id = Date.now();
    this.button = this.clonedMessageView.getElementsByClassName('message-button')[0];
    this.transparentDiv = document.createElement('div');
    this.transparentDiv.className = 'transparent-div';

    const messageNode = this.clonedMessageView.getElementsByClassName('message-text')[0];
    const titleNode = this.clonedMessageView.getElementsByClassName('message-title')[0];

    messageNode.innerText = message;
    titleNode.innerText = title;
  }

  show(callback = () => {}) {
    this.button.addEventListener('click', () => {
      this.hide();
      callback();
    });

    this.clonedMessageView.style.display = 'block';
    document.getElementsByTagName('body')[0].appendChild(this.transparentDiv);
    document.getElementsByTagName('body')[0].appendChild(this.clonedMessageView);

    this.clonedMessageView.animate([
      { transform: `translateY(-${this.clonedMessageView.offsetTop + this.clonedMessageView.offsetHeight}px)` },
      { transform: 'translateY(0px)' }
    ], { duration: 200 })
  }

  hide() {
    document.getElementsByTagName('body')[0].removeChild(this.transparentDiv);
    document.getElementsByTagName('body')[0].removeChild(this.clonedMessageView);
  }
};
