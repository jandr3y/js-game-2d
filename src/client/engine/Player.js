class Player {
  constructor(game, settings = {}) {
    this.sprite       = new Image();
    this.game         = game;
    this.spriteSize   = 32;
    this.tick         = 0;
    this.tickPerFrame = 10;
    this.frameIndex   = 0;
    this.maxFrame     = 3;
    this.direction    = 0;
    this.speed        = 0;
    this.maxX         = (100 * map.tileSize) - game.canvas.width;
    this.maxY         = (100 * map.tileSize) - game.canvas.height;
    this.x            = 800;
    this.y            = 2200;
    this.settings     = settings;
  }

  load() {
    return new Promise((resolve, reject) => {
      this.sprite.src = 'assets/person.png';
      this.sprite.addEventListener('load', () => resolve());
    });
  }

  render() {

    const canvasX = (this.game.canvas.width / 2) - 16;
    const canvasY = (this.game.canvas.height / 2) - 16;

    this.tick++;

    if ( this.tick > this.tickPerFrame ) {
      this.frameIndex++;
      this.tick = 0;
    }

    if ( this.frameIndex >= this.maxFrame ) {
      this.frameIndex = 0;
    }

    if ( this.speed > 4 ) {
      this.tickPerFrame = 3;
      this.game.context.drawImage(
        this.sprite, 
        this.frameIndex * this.spriteSize, 
        this.direction * this.spriteSize, 
        this.spriteSize, 
        this.spriteSize, 
        canvasX, 
        canvasY, 
        this.spriteSize, 
        this.spriteSize
      );
    } else if ( this.speed > 0 ) {
      this.tickPerFrame = 10;
      this.game.context.drawImage(this.sprite, this.frameIndex * this.spriteSize, this.direction * this.spriteSize, this.spriteSize, this.spriteSize, canvasX, canvasY, this.spriteSize, this.spriteSize);
    } else {
      this.game.context.drawImage(this.sprite, this.spriteSize, this.direction * this.spriteSize, this.spriteSize, this.spriteSize, canvasX, canvasY, this.spriteSize, this.spriteSize);
    }

  }

  checkColision(collisionLayer, direction) {

    if ( !collisionLayer ) {
      return true;
    }

    let checkX = this.x;
    let checkY = this.y;

    if ( direction === 'UP' ) {
      checkY -= this.speed + (this.settings.COLLISION_PRED.UP || 18);
    }

    if ( direction === 'DOWN' ) {
      checkY += this.speed + (this.settings.COLLISION_PRED.DOWN || 18);
    }

    if ( direction === 'RIGHT' ) {
      checkX += this.speed + (this.settings.COLLISION_PRED.RIGHT || 10);
    }

    if ( direction === 'LEFT' ) {
      checkX -= this.speed + (this.settings.COLLISION_PRED.LEFT || 10);
    }
    
    const canvasWSpace = (this.game.canvas.width / 2);
    const canvasHSpace = (this.game.canvas.height / 2);
    checkX = Math.floor((checkX + canvasWSpace) / this.spriteSize);
    checkY = Math.floor((checkY + canvasHSpace) / this.spriteSize);
    const tileIndex = Math.floor(checkY * 100 + checkX);
    
    if ( collisionLayer.data[tileIndex] === this.game.settings.collisionID ) {
      return true;
    }

    return false;
  }

  movement({ KEYS }, collisionLayer = null) {

    if ( KEYS.ArrowDown || KEYS.ArrowLeft || KEYS.ArrowUp || KEYS.ArrowRight ) {
      if ( KEYS.ArrowDown ) {
        if ( !this.checkColision(collisionLayer, 'DOWN') ) {
          this.y += this.speed;
        } else {
          this.speed = 0;
        }
      } 
  
      if ( KEYS.ArrowUp ) {
        if ( !this.checkColision(collisionLayer, 'UP') ) {
          this.y -= this.speed;
        } else {
          this.speed = 0;
        }
      } 
  
      if ( KEYS.ArrowRight ) {
        if ( !this.checkColision(collisionLayer, 'RIGHT') ) {
          this.x += this.speed;
        } else {
          this.speed = 0;
        }
      } 
  
      if ( KEYS.ArrowLeft ) {
        if ( !this.checkColision(collisionLayer, 'LEFT') ) {
          this.x -= this.speed;
        } else {
          this.speed = 0;
        }
      }
      
      if ( this.speed < (this.settings.MAX_SPEED || 5) ) {
        this.speed += this.settings.SPEED || 0.08;
      }
    } else {
      this.speed = 0;
    }

    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
  }

  changeDirection({ KEYS }) {
    if ( KEYS.ArrowUp ) {
      this.direction = 3;
    }

    if ( KEYS.ArrowDown ) {
      this.direction = 0;
    }

    if ( KEYS.ArrowRight ) {
      this.direction = 2;
    }

    if ( KEYS.ArrowLeft ) {
      this.direction = 1;
    }
  }



  debug() {
    DEBUG_BAR.innerText = `Player X: ${(this.x / this.spriteSize).toFixed(3)} - Player.Y: ${(this.y / this.spriteSize).toFixed(3)} - Speed: ${this.speed.toFixed(3)}`
  }
}