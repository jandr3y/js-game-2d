class Player extends Creature {
  constructor(game, settings = {}) {
    super(game, settings);

    this.x            = 700;
    this.y            = 2200;
  }


  debug() {
    DEBUG_BAR.innerText = `Player X: ${(this.x).toFixed(3)} - Player.Y: ${(this.y).toFixed(3)} - Speed: ${this.speed.toFixed(3)}`
  }
}