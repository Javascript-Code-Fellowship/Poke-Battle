const port = process.env.PORT || 3000;
const io = require('socket.io')(port);

const pokeHub = io.of('/pokehub');

//start it up!!!

const queue = []

// pokeHub.emit("create-player");

pokeHub.on("connection", (socket) => {

  socket.on('player-created', payload => {
    queue.push(payload)
    console.log('Queue:', queue)
    if (queue.length >= 2) {
      //join clients to a room when they connect
      console.log('2!!!')
      let roomName = `${queue[0].player}-vs-${queue[1].player}`
      pokeHub.emit(`${queue[0].player}`, roomName)
      pokeHub.emit(`${queue[1].player}`, roomName)
      queue.shift()
      queue.shift()
    }
  })
  console.log("global", socket.id);


  socket.on("join", (payload) => {
    socket.join(`${payload.roomName}`);
    console.log(`${payload.player} joined`);
    const output = `${payload.player} is ready to fight!`;
    pokeHub.to(`${payload.roomName}`).emit("joined", output);

  });

  socket.on('quick-attack', (payload) => {
    //   let damage = payload.move.damage
    console.log('quick attack');

    const output = {
      // damage: damage,
      message: 'You were hit with a quick attack!',
    };
    //emits to just the other player
    socket.to(`${payload.roomName}`).emit("quick-attack", payload);
  });

  socket.on('heavy-attack', (payload) => {
    //   let damage = payload.move.damage
    console.log('heavy attack');

    const output = {
      // damage: damage,
      message: 'You were hit with a heavy attack!',
    };
    //emits to just the other player
    socket.to(`${payload.roomName}`).emit("heavy-attack", payload);
  });

  socket.on('heal-self', (payload) => {
    let player = payload.player;
    console.log(`${player} used heal-self!`);
  });

  socket.on('ko', (payload) => {
    console.log(`${payload.player} was knocked out!`);
  });
});
