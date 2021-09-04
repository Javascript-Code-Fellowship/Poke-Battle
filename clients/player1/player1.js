'use strict';

const io = require('socket.io-client');
const Player = require('../player-generator');
const server = io.connect('http://localhost:3000/pokehub');
const faker = require('faker');
const { Socket } = require('socket.io');

let profile = null;

const joinFight = async () => {
  profile = new Player(faker);
  server.emit('join', profile)
}

joinFight();

// quickHit(KeyCodeArr) (async () => {
//   if (KeyCodeArr[32]) {
//     socket.emit('quick-attack', payload)
//   }
// })

server.on('joined', (payload) => {
  console.log(payload);
})

server.on('quick-attack', (payload) => {
  profile.health = profile.health - 1;
  // console.log(`${payload.name}`, payload.health)
  if (profile.health > 0) {
    server.emit('broadcast-health', payload);
  } else if (profile.health <= 0) {
    console.log('KO!!!')
    server.emit('ko', profile);
  }
})

server.on('heavy-attack', (payload) => {
  // console.log(`${payload.name}`, payload.health)
  profile.health = profile.health - 2;
  if (profile.health > 0) {
    server.emit('broadcast-health', payload);
  } else if (profile.health <= 0) {
    server.emit('ko', profile);
  }
})

server.on('heal-self', (payload) => {
  // console.log(`${payload.name}`, payload.health)
  profile.health = profile.health + 1;
  server.emit('broadcast-health', profile);
})

const payload = new Player(faker)
payload.player = `Player1`
setInterval( () => {
  // const payload = new Player(faker)
  server.emit('quick-attack', payload)
}, 1000)

setInterval( () => {
  // const payload = new Player(faker)
  server.emit('heavy-attack', payload)
}, 3000)

setInterval( () => {
  // const payload = new Player(faker)
  server.emit('heal-self', payload)
}, 5000)

module.exports = { };

module.exports = { };

// server.emit('hit sent', payload);

// server.emit('heavy attack sent', payload);