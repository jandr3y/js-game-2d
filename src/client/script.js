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

const game     = new Game(GAME_SETTINGS);
const map      = new Map(game);
const keyboard = new Keyboard();
const camera   = new Camera(map);
const player   = new Player(game, PLAYER_SETTINGS);

// gameloop
game.gameloop(() => {
  player.changeDirection(keyboard);
  
  if ( map.tilemap ) {
    player.movement(keyboard, map.tilemap.layers[4]);
  }

  camera.follow(player);

  map.render(camera);
  player.render(camera);
  map.render(camera, true);

  player.debug();
});

// run before gameloop, single time
game.run(async () => {
  await map.load();
  await player.load();
  keyboard.listen();
});
