class Socket {

  constructor(settings) {
    this.socket = io("http://192.168.100.6:3000"); 
    this.lastPlayersData = {};
    this.lastMonstersData = {
      'm1': {
        x: 900,
        y: 2000,
        d: 0,
        s: 10
      }
    };
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

  simulateMonsterMovement(player, monster, colisionLayer) 
  {
    Object.keys(this.lastMonstersData).map( index => {
      const monsterData = this.lastMonstersData[index];
      const fakeKeyboard = { KEYS: {} }
      if ( player.x - player.spriteSize > monsterData.x ) fakeKeyboard.KEYS.ArrowRight = true;
      if ( player.x + player.spriteSize < monsterData.x ) fakeKeyboard.KEYS.ArrowLeft = true;
      if ( player.y + player.spriteSize > monsterData.y ) fakeKeyboard.KEYS.ArrowDown = true;
      if ( player.y - player.spriteSize < monsterData.y ) fakeKeyboard.KEYS.ArrowUp = true;

      monsterData.x = monster.x;
      monsterData.y = monster.y;
      monster.changeDirection(fakeKeyboard);
      
      monster.movement(fakeKeyboard, colisionLayer, map.colisionMatrix)
    })
  }
}