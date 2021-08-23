class Socket {

  constructor(settings) {
    this.socket = io("http://localhost:3000"); 
    this.lastPlayersPosition = {};
    this.uid = settings.UID;

    this.players = {};
  }

  identify() {
    return { UID: this.uid };
  }

  onMovement(cb) {
    this.socket.on('player_move', data => {
      this.lastPlayersPosition[data.UID] = { x: data.x, y: data.y };
      if (cb) cb();
    });
  }

  playerMovement(player) {
    const { x, y } = this.lastPlayersPosition[this.uid] ?? { x: 0, y: 0 };
    this.lastPlayersPosition[this.uid] = { x: player.x, y: player.y, ...this.identify() };
    
    if ( player.x !== x || player.y !== y ) {
      this.socket.emit('movement', this.lastPlayersPosition[this.uid]);
    }
  }

  createPlayer(playerSettings) {
    this.players[playerSettings.uid] = new Player(playerSettings);
  }
}