const port = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const pokeHub = io.of('/pokehub');
app.use(express.json());
const Player = require('./clients/player-generator');
const queue = [];

pokeHub.on('connection', (socket) => {
  socket.on('player-created', (payload) => {
    console.log(payload);
    queue.push(payload);
    if (queue.length >= 2) {
      //join clients to a room when they connect
      let roomName = `${queue[0].player}-vs-${queue[1].player}`;
      pokeHub.emit('dequeue', { roomName, player: queue[0] });
      pokeHub.emit('dequeue', { roomName, player: queue[1] });
      queue.shift();
      queue.shift();
    }
  });
  console.log('global', socket.id);

  socket.on('join', (payload) => {
    socket.join(`${payload.roomName}`);
    console.log(`${payload.player.player} joined`);
    socket.emit('joined');
  });

  socket.on('quick-attack', (payload) => {
    //   let damage = payload.move.damage
    console.log('quick attack', payload);

    const output = {
      // damage: damage,
      message: 'You were hit with a quick attack!',
    };
    //emits to just the other player
    socket.to(`${payload.roomName}`).emit('quick-attack', payload);
  });

  socket.on('heavy-attack', (payload) => {
    //   let damage = payload.move.damage
    console.log('heavy attack');

    const output = {
      // damage: damage,
      message: 'You were hit with a heavy attack!',
    };
    //emits to just the other player
    socket.to(`${payload.roomName}`).emit('heavy-attack', payload);
  });

  socket.on('heal-self', (payload) => {
    let player = payload.player;
    console.log(`${player} used heal-self!`);
  });

  socket.on('ko', (payload) => {
    console.log(`${payload.player} was knocked out!`);
  });
});

app.post('/signup', signupHandler);

async function signupHandler(req, res, next) {
  console.log('signed up!');
  const { name, catchphrase } = req.body;
  const newPlayer = new Player(name, catchphrase);
  pokeHub.emit('player-created', newPlayer);
  res.status(200).json({ message: 'get ready to battle' });
}
server.listen(port, () => {
  console.log('listening!');
});
