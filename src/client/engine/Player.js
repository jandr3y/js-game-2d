class Player {
  constructor(game) {
    this.sprite = new Image();
    this.game = game;
    this.spriteSize = 32;
    this.tick = 0;
    this.tickPerFrame = 10;
    this.frameIndex = 0;
    this.maxFrame = 3;
    this.direction = 0;
    this.speed = 0;
    this.maxX = (100 * map.tileSize) - game.canvas.width;
    this.maxY = (100 * map.tileSize) - game.canvas.height;
    this.x = 300;
    this.y = 400;
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
      this.game.context.drawImage(this.sprite, this.frameIndex * 32, this.direction * 32, 32, 32, canvasX, canvasY, 32, 32);
    } else if ( this.speed > 0 ) {
      this.tickPerFrame = 10;
      this.game.context.drawImage(this.sprite, this.frameIndex * 32, this.direction * 32, 32, 32, canvasX, canvasY, 32, 32);
    } else {
      this.game.context.drawImage(this.sprite, 32, this.direction * 32, 32, 32, canvasX, canvasY, 32, 32);
    }

  }

  checkColision(collisionLayer, direction) {

    if ( !collisionLayer ) {
      return true;
    }

    let checkX = this.x;
    let checkY = this.y;

    if ( direction === 'UP' ) {
      checkY -= this.speed;
    }

    if ( direction === 'DOWN' ) {
      checkY += this.speed + 18;
    }

    if ( direction === 'RIGHT' ) {
      checkX += this.speed + 10;
    }

    if ( direction === 'LEFT' ) {
      checkX -= this.speed + 10;
    }
    
    const canvasWSpace = (this.game.canvas.width / 2);
    const canvasHSpace = (this.game.canvas.height / 2);
    checkX = Math.floor((checkX + canvasWSpace) / 32);
    checkY = Math.floor((checkY + canvasHSpace) / 32);
    
    const tileIndex = Math.floor(checkY * 100 + checkX);
    
    if ( collisionLayer.data[tileIndex] === 799 ) {
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
      
      if ( this.speed < 5 ) {
        this.speed += 0.08;
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
    DEBUG_BAR.innerText = `Player X: ${this.x / this.spriteSize} - Player.Y: ${this.y / this.spriteSize}`
  }
}