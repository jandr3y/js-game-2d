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
  
}