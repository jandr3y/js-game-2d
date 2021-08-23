const GAME_SETTINGS = {
  collisionID: 369
};

const PLAYER_SETTINGS = {
  MAX_SPEED: 3.5,
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

// gameloop
game.gameloop(() => {
  player.changeDirection(keyboard);
  
  if ( map.tilemap ) {
    player.movement(keyboard, map.tilemap.layers[4]);
  }

  camera.follow(player);

  map.render(camera);
  player.render();
  map.render(camera, true);

  Object.keys(socket.lastPlayersPosition).map( index => {
    if ( index !== SOCKET_SETTINGS.UID ) {
      const playerPosition = socket.lastPlayersPosition[index];
      player.render(playerPosition);
    }
  });

  player.debug();

});

// run before gameloop, single time
game.run(async () => {
  await map.load();
  await player.load();
  keyboard.listen();
  
  game.event(() => socket.playerMovement(player), 200);

  socket.onMovement(() => { console.log('hi')
  })
});
