const game = new Game();
const map = new Map(game);
const keyboard = new Keyboard();
const camera = new Camera(map);
const player = new Player(game);

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
