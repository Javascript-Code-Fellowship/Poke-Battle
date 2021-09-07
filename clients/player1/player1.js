'use strict';

const io = require('socket.io-client');
const server = io.connect('http://localhost:3000/pokehub');

const inquirer = require('inquirer');
let profile;

server.on('player-created', (payload) => {
  server.emit('player-created', payload);
});

server.on('dequeue', (payload) => {
  profile = payload.player;
  server.emit('join', payload);
});

server.on('joined', (payload) => {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'ready',
        message: 'Are you ready?',
        choices: ['Yes', 'No'],
      },
    ])
    .then((answers) => {
      console.log(`Player is: ${answers.ready}`);
      if (answers.ready === 'Yes') {
        userInterface();
      }
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.log(error);
      } else {
        console.log(error);
      }
    });
});

server.on('quick-attack', (payload) => {
  profile.health = profile.health - 1;
  // console.log(`${payload.name}`, payload.health)
  if (profile.health > 0) {
    server.emit('broadcast-health', payload);
  } else if (profile.health <= 0) {
    console.log('KO!!!');
    server.emit('ko', profile);
  }
});

server.on('heavy-attack', (payload) => {
  // console.log(`${payload.name}`, payload.health)
  profile.health = profile.health - 2;
  if (profile.health > 0) {
    server.emit('broadcast-health', payload);
  } else if (profile.health <= 0) {
    server.emit('ko', profile);
  }
});

server.on('heal-self', (payload) => {
  // console.log(`${payload.name}`, payload.health)
  profile.health = profile.health + 1;
  server.emit('broadcast-health', profile);
});

async function userInterface() {
  if (profile.health > 0) {
    let answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What move will you select?',
        choices: ['quick-attack', 'heavy-attack', 'heal-self', 'quit'],
      },
    ]);
    switch (answer.action) {
      case 'quick-attack':
        console.log(answer.action);
        server.emit('quick-attack', profile);
        userInterface();
        break;
      case 'heavy-attack':
        setTimeout(() => {
          server.emit('heavy-attack', profile);
        }, 3000);
        userInterface();
        break;
      case 'heal-self':
        server.emit('heal-self', profile);
        userInterface();
        break;
      case 'quit':
        return;
    }
  }
}

module.exports = {};

module.exports = {};

// server.emit('hit sent', payload);

// server.emit('heavy attack sent', payload);
