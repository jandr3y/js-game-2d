class Socket {

  constructor(settings) {
    this.socket = io("http://177.7.145.24:3000"); 
    this.lastPlayersData = {};
    this.uid = settings.UID;

    this.players = {};
  }

  identify() {
    return { UID: this.uid };
  }

  onMovement(cb) {
    this.socket.on('player_move', cb);
  }

  playerMovement(player) {
    const { x, y } = this.lastPlayersData[this.uid] ?? { x: 0, y: 0, d: 0, s: 0 };
    this.lastPlayersData[this.uid] = { 
      x: player.x, 
      y: player.y,
      d: player.direction,
      s: player.speed, 
      ...this.identify() 
    };
    
    if ( player.x !== x || player.y !== y ) {
      this.socket.emit('movement', this.lastPlayersData[this.uid]);
    }
  }

  createPlayer(playerSettings) {
    this.players[playerSettings.uid] = new Player(playerSettings);
  }
}