export default class Keyboard {
  constructor() {
    this._keyCodes = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'bottom',
    };

    this.keys = {
      left: false,
      up: false,
      right: false,
      bottom: false,
    };

    window.addEventListener('keydown', (event) => this.onKeyDown(event));
    window.addEventListener('keyup', (event) => this.onKeyUp(event));
  }

  onKeyUp(event) {
    const key = this._keyCodes[event.keyCode];
    this.keys[key] = false;
  }

  onKeyDown(event) {
    const key = this._keyCodes[event.keyCode];
    this.keys[key] = true;
  }
}