const GAME_SETTINGS = {
  collisionID: 369
};

const PLAYER_SETTINGS = {
  SPRITE: 'assets/person.png',
  MAX_SPEED: 1.5,
  SPEED_AG: 0.8,
  COLLISION_PRED: {
    LEFT: 16,
    RIGHT: 16,
    UP: 16,
    DOWN: 16
  }
}

const MONSTER_SETTINGS = {
  SPRITE: 'assets/bat.png',
  MAX_SPEED: 0.8,
  SPEED_AG: 0.02,
  COLLISION_PRED: {
    LEFT: 16,
    RIGHT: 16,
    UP: 16,
    DOWN: 16
  }
}

const SOCKET_SETTINGS = {
  UID: localStorage.getItem('uid') || Math.random().toString(16).slice(2)
}

const game     = new Game(GAME_SETTINGS);
const map      = new Map(game);
const keyboard = new Keyboard();
const camera   = new Camera(map);
const player   = new Player(game, PLAYER_SETTINGS);
const monster  = new Monster(game, MONSTER_SETTINGS)
const socket   = new Socket(SOCKET_SETTINGS);

let renderCache = {};
// gameloop
game.gameloop(() => {
  player.changeDirection(keyboard);
  
  if ( map.tilemap ) {
    player.movement(keyboard, map.tilemap.layers[4]);
    monster.movement(map.tilemap.layers[4], map.colisionMatrix);
  }

  camera.follow(player);

  map.render(camera);
  player.render();
  
  Object.keys(socket.lastPlayersData).map( index  => {
    const playerData = socket.lastPlayersData[index];
    
    if( renderCache[index] && renderCache[index].s === playerData.s ) {
      playerData.s = 0;
    }

    if ( playerData.UID !== SOCKET_SETTINGS.UID && camera.isBoundarie(playerData) ) {
      renderCache[index] = playerData;
      player.render(playerData, camera);
    }
  });

  monster.render({ x: monster.x, y: monster.y, s: monster.speed, d: monster.direction }, camera);

  map.render(camera, true);

  player.debug();

});

// run before gameloop, single time
game.run(async () => {
  await map.load();
  await player.load();
  await monster.load();
  monster.setEnemy(player);
  keyboard.listen();
  
  game.event(() => socket.playerMovement(player), 1);

  socket.onMovement(data => {
    socket.lastPlayersData[data.UID] = { ...data };
  })
});
