class Creature {

  constructor(game, settings) {
    this.game         = game;
    this.settings     = settings;
    this.spriteSize   = 32;
    this.tick         = 0;
    this.tickPerFrame = 16;
    this.frameIndex   = 0;
    this.maxFrame     = 3;
    this.direction    = 0;
    this.speed        = 0;
    this.maxX         = (100 * map.tileSize) - game.canvas.width;
    this.maxY         = (100 * map.tileSize) - game.canvas.height;
    this.sprite = new Image();
  }

  load() {
    return new Promise((resolve, reject) => {
      this.sprite.src = this.settings.SPRITE;
      this.sprite.addEventListener('load', () => resolve());
    });
  }

  render(pos, camera) {

    let canvasX, canvasY, direction, speed = 0;

    // if position is passed as parameter, 
    if ( pos ) {
      speed   = pos.s;
      canvasX = Math.round(pos.x - (camera.x - (camera.width / 2)) - (this.spriteSize / 2));
      canvasY = Math.round(pos.y - (camera.y - (camera.height / 2)) - (this.spriteSize / 2));
      direction = pos.d;
    } else {
      direction = this.direction;
      speed = this.speed;
      canvasX = (this.game.canvas.width / 2) - (this.spriteSize / 2);
      canvasY = (this.game.canvas.height / 2) - (this.spriteSize / 2);
    }

    if ( ++this.tick > this.tickPerFrame ) {
      this.frameIndex++;
      this.tick = 0;
    }

    if ( this.frameIndex >= this.maxFrame ) {
      this.frameIndex = 0;
    }

    if ( speed > 4 ) {
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
    } else if ( speed > 0 ) {
      this.game.context.drawImage(this.sprite, this.frameIndex * this.spriteSize, direction * this.spriteSize, this.spriteSize, this.spriteSize, canvasX, canvasY, this.spriteSize, this.spriteSize);
    } else {
      this.game.context.drawImage(this.sprite, this.spriteSize, direction * this.spriteSize, this.spriteSize, this.spriteSize, canvasX, canvasY, this.spriteSize, this.spriteSize);
    }
  }

  movement({ KEYS }, collisionLayer = null, mappedColisionLayer = null) {
    
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
        this.speed += this.settings.SPEED_AG;
      }
    } else {
      this.speed = 0;
    }

    this.x = Math.max(0, Math.min(this.x, this.maxX));
    this.y = Math.max(0, Math.min(this.y, this.maxY));
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

  changeDirection(event = null) {

    const { KEYS } = event;

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
}