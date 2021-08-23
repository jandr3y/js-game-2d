class Game {

  constructor(settings = {}) {
    this.canvas = document.getElementById('root');
    this.context = this.canvas.getContext('2d');
    this.settings = settings;
  }

  gameloop(fn = null) {
    const loop = function() {
      if ( fn ) fn();
      window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
  }

  run(cb) {
    cb();
    this.gameloop();
  }

}