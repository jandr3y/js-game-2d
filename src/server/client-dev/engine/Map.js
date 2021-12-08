class Map {
  constructor(game) {
    this.tilemap      = null;
    this.tileset      = new Image();
    this.tileSize     = 32;
    this.game         = game;
    this.imageColumns = 0;
    this.mapColumns   = 100;
    this.colisionMatrix = [];
  }

  load() {
    return new Promise((resolve, reject) => {

      fetchLocal('assets/map_two.json?v=3')
        .then( response => response.json() )
        .then( jsonMap => {
          this.tilemap = jsonMap;
          
          if ( Array.isArray(jsonMap.layers) ) {
            jsonMap.layers.forEach( layer => {
              if ( layer.name.indexOf('Colision') !== -1 ) {
                this.colisionMatrix = this.reshape(layer.data, 100, 100);
              }
            })
          }

          this.tileset.src = 'assets/base_out_atlas.png';
          this.tileset.addEventListener('load', () => {
            this.imageColumns = this.tileset.width / this.tileSize;
            resolve()
          });
        })
    })
  }


  render(camera, up = false) {

    if ( !this.tilemap ) {
      return;
    }

    const IMAGE_COLUMNS = this.tileset.width / this.tileSize;

    var startCol  = Math.floor(camera.x / this.tileSize);
    var endCol    = startCol + (camera.width / this.tileSize);
    var startRow  = Math.floor(camera.y / this.tileSize);
    var endRow    = startRow + (camera.height / this.tileSize);
    var offsetX   = -camera.x + startCol * this.tileSize;
    var offsetY   = -camera.y + startRow * this.tileSize;
    let tileIndex = 0;

    const layersCount = Array.from(this.tilemap.layers).length;

    for ( let l = 0; l < layersCount; l++ ) {

      if ( up ) {
        if ( this.tilemap.layers[l].name.indexOf('_UP') === -1 ) {
          continue;
        }
      }

      tileIndex = (startRow * this.mapColumns) + startCol;
      
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

        tileIndex += this.mapColumns - (this.game.canvas.width / this.tileSize); // Descobrir o 100
        
        this.lastTileIndex = tileIndex;
      }
    }
  }
 
  // map 1d vector to 2d vector
  reshape(array, rows, cols) {
    const copy = array.slice(0);
    const mapped = [];

    for (var r = 0; r < rows; r++) {
      const row = [];
      for (var c = 0; c < cols; c++) {
        var i = r * cols + c;
        if (i < copy.length) {
          row.push((copy[i] == 0 ? 0 : 1));
        }
      }
      mapped.push(row);
    }

    return mapped;
  }
}