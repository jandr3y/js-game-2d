class Monster extends Creature {
  constructor(game, settings){
    super(game, settings)
    this.x            = 800;
    this.y            = 2200;
    this.target       = null;
    this.enemy        = null;  
    this.maxX         = (100 * map.tileSize) - game.canvas.width;
    this.maxY         = (100 * map.tileSize) - game.canvas.height;
    this.pathSequence = [];
    this.pathTickLimit = 10;
    this.pathTickCount = 0;
    this.logged = false;
  }

  setEnemy(enemy) {
    this.enemy = enemy;
  }

  pathfinder(x, y, mappedColisionLayer, agv) {
    const mX = parseInt(this.x / 32);
    const mY = parseInt(this.y / 32);
    const eX = parseInt(x / 32);
    const eY = parseInt(y / 32);
    const grid = new PF.Grid(mappedColisionLayer);
    const finder = new PF.AStarFinder({ allowDiagonal: false });
    this.pathSequence = finder.findPath(mY, mX, eY, eX, grid).map( pos => {
      return { 
        x: (pos[1] * 32), 
        y: (pos[0] * 32)
      }
    });
  }

  movement(colisionLayer, mappedColisionLayer) {
    this.pathTickCount++;

    if ( this.target || this.enemy ) {

      if ( this.pathSequence.length > 0 ) {
        this.target = this.pathSequence[0];
      } else {
        this.target = null;
      }

      let { x, y } = this.target || this.enemy;
      let directionChanged = false;

      if ( this.x > x + this.spriteSize ) {
        if ( !this.checkColision(colisionLayer, 'LEFT') ) {
          this.x -= this.speed;

          if ( !directionChanged ) this.direction = 1;
          directionChanged = true;
        } else {
          if ( this.pathSequence.length === 0) this.pathfinder(x, y, mappedColisionLayer, -1)
        }
      } else if ( this.x < x + this.spriteSize ) {
        if ( !this.checkColision(colisionLayer, 'RIGHT') ) {
          this.x += this.speed;
          if ( !directionChanged ) this.direction = 2;
          directionChanged = true;
        } else {
          if ( this.pathSequence.length === 0) this.pathfinder(x, y, mappedColisionLayer, 1)
        }
      }

      if ( this.y > y + this.spriteSize ) {
        if ( !this.checkColision(colisionLayer, 'UP') ) {
          this.y -= this.speed;

          if ( !directionChanged ) this.direction = 3;
          directionChanged = true;
        } else {
          if ( this.pathSequence.length === 0) this.pathfinder(x, y, mappedColisionLayer, 1)
        }
      } else if ( this.y < y + this.spriteSize ) {
        if ( !this.checkColision(colisionLayer, 'DOWN') ) {
          this.y += this.speed;
          if ( !directionChanged ) this.direction = 0;
          directionChanged = true;
        } else {
          if ( this.pathSequence.length === 0) this.pathfinder(x, y, mappedColisionLayer, -1)
        }
      } 


      if ( this.speed < (this.settings.MAX_SPEED || 5) ) {
        this.speed += this.settings.SPEED_AG;
      }

      if ( this.pathTickCount >= this.pathTickLimit ) {
        console.log(JSON.stringify(this.pathSequence))
        this.pathSequence.shift();
        this.pathTickCount = 0;
      }

      this.x = Math.max(0, Math.min(this.x, this.maxX));
      this.y = Math.max(0, Math.min(this.y, this.maxY));
    }
  }
}

