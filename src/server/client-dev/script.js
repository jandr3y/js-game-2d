const GAME_SETTINGS = {
  collisionID: 369
};

const PLAYER_SETTINGS = {
  MAX_SPEED: 1.5,
  SPEED: 0.1,
  COLLISION_PRED: {
    LEFT: 4,
    RIGHT: 6,
    UP: 6,
    DOWN: 6
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
const socket   = new Socket(SOCKET_SETTINGS);

let renderCache = {};
// gameloop
game.gameloop(() => {
  player.changeDirection(keyboard);
  
  if ( map.tilemap ) {
    player.movement(keyboard, map.tilemap.layers[4]);
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
  })

  map.render(camera, true);

  player.debug();

});

// run before gameloop, single time
game.run(async () => {
  await map.load();
  await player.load();
  keyboard.listen();
  
  game.event(() => socket.playerMovement(player), 1);

  socket.onMovement(data => {
    socket.lastPlayersData[data.UID] = { ...data };
  })
});
