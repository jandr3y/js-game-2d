const express = require('express');
const http = require('http');
const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server);

const DEV_MODE = true;

const CLIENT_PATH = DEV_MODE 
  ? __dirname + '/client-dev' 
  : __dirname + '/client';

app.set('views', CLIENT_PATH);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(CLIENT_PATH));

app.get('/', function(request, response){
  response.render(DEV_MODE ? 'dev' : 'index');
});

io.on('connection', socket => {
  console.log('connected')

  socket.on('movement', function(data) {
    io.sockets.emit('player_move', data);
  })
})

server.listen(3000, () => {
  console.log('Servidor Rodando')
});