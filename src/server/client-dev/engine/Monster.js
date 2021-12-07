class Monster extends Creature {
  constructor(game, settings){
    super(game, settings)
    this.x            = 800;
    this.y            = 2200;
    this.target       = null;
    this.enemy        = null;  
    this.maxX         = (100 * map.tileSize) - game.canvas.width;
    this.maxY         = (100 * map.tileSize) - game.canvas.height;
    this.logged = false;
  }

  setEnemy(enemy) {
    this.enemy = enemy;
  }

  movement(colisionLayer, mappedColisionLayer) {
    if ( this.target || this.enemy ) {
      let { x, y } = this.target || this.enemy;
      let directionChanged = false;

      if ( this.x > x + this.spriteSize ) {
        if ( !this.checkColision(colisionLayer, 'LEFT') ) {
          this.x -= this.speed;

          if ( !directionChanged ) this.direction = 1;
          directionChanged = true;
        } else {
          if ( !this.logged ) {
            const mX = parseInt(this.x / 32);
            const mY = parseInt(this.y / 32);
            const eX = parseInt(x / 32);
            const eY = parseInt(y / 32);
            const path = new Graph(mappedColisionLayer);
            const result = astar.search(path, path.grid[mX][mY], path.grid[eX][eY]);
            console.log(result)
            this.logged = true;
          }
        }
      } else if ( this.x < x - this.spriteSize ) {
        if ( !this.checkColision(colisionLayer, 'RIGHT') ) {
          this.x += this.speed;
          if ( !directionChanged ) this.direction = 2;
          directionChanged = true;
        } else {
          if ( !this.logged ) {
            const mX = parseInt(this.x / 32);
            const mY = parseInt(this.y / 32);
            const eX = parseInt(x / 32);
            const eY = parseInt(y / 32);
            const path = new Graph(mappedColisionLayer);
            console.log(path.grid[mX][mY])
            console.log(path.grid[eX][eY])
            const result = astar.search(path, path.grid[mX][mY], path.grid[eX][eY]);
            console.log(path.grid)
            console.log(result)
            this.logged = true;
          }
        }
      }

      if ( this.y > y + this.spriteSize ) {
        if ( !this.checkColision(colisionLayer, 'UP') ) {
          this.y -= this.speed;

          if ( !directionChanged ) this.direction = 3;
          directionChanged = true;
        } else {
          if ( !this.logged ) {
            const mX = parseInt(this.x / 32);
            const mY = parseInt(this.y / 32);
            const eX = parseInt(x / 32);
            const eY = parseInt(y / 32);
            const path = new Graph(mappedColisionLayer);
            const result = astar.search(path, path.grid[mX][mY], path.grid[eX][eY]);
            console.log(result)
            this.logged = true;
          }
        }
      } else if ( this.y < y - this.spriteSize ) {
        if ( !this.checkColision(colisionLayer, 'DOWN') ) {
          this.y += this.speed;
          if ( !directionChanged ) this.direction = 0;
          directionChanged = true;
        } else {
          if ( !this.logged ) {
            const mX = parseInt(this.x / 32);
            const mY = parseInt(this.y / 32);
            const eX = parseInt(x / 32);
            const eY = parseInt(y / 32);
            const path = new Graph(mappedColisionLayer);
            const result = astar.search(path, path.grid[mX][mY], path.grid[eX][eY]);
            console.log(result)
            this.logged = true;
          }
        }
      } 


      if ( this.speed < (this.settings.MAX_SPEED || 5) ) {
        this.speed += this.settings.SPEED_AG;
      }

      this.x = Math.max(0, Math.min(this.x, this.maxX));
      this.y = Math.max(0, Math.min(this.y, this.maxY));
    }
  }
}

