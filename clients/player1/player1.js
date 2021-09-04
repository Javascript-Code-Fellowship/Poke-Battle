'use strict';

const io = require('socket.io-client');
const Player = require('../player-generator');
const server = io.connect('http://localhost:3000');


joinFight (async () => {
  const profile = new Player;
  server.emit('join', profile)
})

// quickHit(KeyCodeArr) (async () => {
//   if (KeyCodeArr[32]) {
//     socket.emit('quick-attack', payload)
//   }
// })

server.on('quick-attack', (payload) => {
  payload.health = payload.health - 1;
  if (payload.health > 0) {
    server.emit('broadcast-health', payload);
  } else if (payload.health <= 0) {
    console.log('VICTORY!')
    server.emit('ko', payload);
  }
})

server.on('heavy-attack', (payload) => {
  payload.health = payload.health - 2;
  if (payload.health > 0) {
    server.emit('broadcast-health', payload);
  } else if (payload.health <= 0) {
    server.emit('ko', payload);
  }
})

server.on('heal-self', (payload) => {
  payload.health = payload.health + 1;
  server.emit('broadcast-health', payload);
})

server.emit('hit sent', payload);

server.emit('heavy attack sent', payload);



