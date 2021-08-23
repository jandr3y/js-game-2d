class Map {
  constructor(game) {
    this.tilemap = null;
    this.tileset = new Image();
    this.tileSize = 32;
    this.game = game;
  }

  load() {
    return new Promise((resolve, reject) => {

      fetchLocal('assets/map_one.json')
        .then( response => response.json() )
        .then( jsonMap => {
          this.tilemap = jsonMap;
          this.tileset.src = 'assets/tileset.png';
          this.tileset.addEventListener('load', () => resolve());
        })
    })
  }


  render(camera, up = false) {

    if ( !this.tilemap ) {
      return;
    }

    const IMAGE_COLUMNS = this.tileset.width / this.tileSize;

    var startCol = Math.floor(camera.x / this.tileSize);
    var endCol = startCol + (camera.width / this.tileSize);
    var startRow = Math.floor(camera.y / this.tileSize);
    var endRow = startRow + (camera.height / this.tileSize);
    var offsetX = -camera.x + startCol * this.tileSize;
    var offsetY = -camera.y + startRow * this.tileSize;
    let tileIndex = 0;

    const layersCount = Array.from(this.tilemap.layers).length;

    for ( let l = 0; l < layersCount; l++ ) {

      if ( up ) {
        if ( this.tilemap.layers[l].name.indexOf('_UP') === -1 ) {
          continue;
        }
      }

      tileIndex = (startRow * 100) + startCol;
      
      for ( let r = startRow; r < endRow; r++) {
        for ( let c = startCol; c < endCol; c++ ) {
          
          if ( this.tilemap.layers[l].name === 'Colision' ) {
            continue;
          }

          const tileID = this.tilemap.layers[l].data[tileIndex];


          if ( tileID === 0 ) { 
            tileIndex++;
            continue; 
          }
  
          const tileXPosition = ((tileID - 1) % IMAGE_COLUMNS) * this.tileSize;
          const tileYPosition = Math.floor(tileID / IMAGE_COLUMNS) * this.tileSize;
  
          var x = (c - startCol) * this.tileSize + offsetX;
          var y = (r - startRow) *  this.tileSize + offsetY;
          
          this.game.context.drawImage(
            this.tileset, 
            tileXPosition, 
            tileYPosition, 
            this.tileSize, 
            this.tileSize,
            Math.round(x), 
            Math.round(y), 
            this.tileSize, 
            this.tileSize
          );
  
          tileIndex++;
        }
        tileIndex += 70; // Descobrir o 100
        
        this.lastTileIndex = tileIndex;
      }
    }
  }
  
}