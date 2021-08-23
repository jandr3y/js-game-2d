class Keyboard {

  constructor() {
    this.KEYS = {
      ArrowDown: false,
      ArrowUp: false,
      ArrowRight: false,
      ArrowLeft: false
    }
  }

  onDown(e) {
    this.KEYS[e.code] = true;
  }

  onUp(e) {
    this.KEYS[e.code] = false;
  }

  listen() {
    window.addEventListener('keydown', e => this.onDown(e));
    window.addEventListener('keyup', e => this.onUp(e));
  }
}