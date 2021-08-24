class Camera {

  constructor(map) {
    this.x = 0;
    this.y = 0;
    this.width = 960;
    this.height = 640;
    this.maxX = (100 * map.tileSize) - this.width;
    this.maxY = (100 * map.tileSize) - this.height;
    this.speed = 1;
  }

  follow(entity) {
    this.x = entity.x;
    this.y = entity.y;
  }

  isBoundarie({ x, y }){
    const minX = this.x - (this.width / 2);
    const maxX = this.x + (this.width / 2); 
    const minY = this.y - (this.height / 2);
    const maxY = this.y + (this.height / 2); 
    return x > minX && x < maxX && y > minY && y < maxY;
  }
  
}