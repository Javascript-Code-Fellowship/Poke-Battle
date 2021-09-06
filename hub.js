const port = process.env.PORT || 3000;
const io = require("socket.io")(port);

const pokeHub = io.of("/pokehub");

//start it up!!!

const queue = []

pokeHub.on("connection", (socket) => {
  pokeHub.emit("create-player");

  socket.on('player-created', payload => {
    queue.push(payload)
  })
  console.log("global", socket.id);

  if (queue.length >= 2) {
    //join clients to a room when they connect
    let roomName = `${queue[0].name}-vs-${queue[1].name}`
    pokeHub.emit(`${queue[0]}`, roomName)
    pokeHub.emit(`${queue[1]}`, roomName)
    queue.shift()
    queue.shift()
  }

  socket.on("join", (payload) => {
    console.log(`${payload.player} joined`);
    socket.join(`${payload.roomName}`);
    const output = `${payload.player} is ready to fight!`;
    pokeHub.to("fightroom").emit("joined", output);
  });

  socket.on("quick-attack", (payload) => {
    //   let damage = payload.move.damage
    console.log("quick attack", payload);

    const output = {
      // damage: damage,
      message: "You were hit with a quick attack!",
    };
    //emits to just the other player
    socket.to("fightroom").emit("quick-attack", payload);
  });

  socket.on("heavy-attack", (payload) => {
    //   let damage = payload.move.damage
    console.log("heavy attack", payload);

    const output = {
      // damage: damage,
      message: "You were hit with a heavy attack!",
    };
    //emits to just the other player
    socket.to("fightroom").emit("heavy-attack", payload);
  });

  socket.on("heal-self", (payload) => {
    let player = payload.player;
    console.log(`${player} used heal-self!`, payload);
  });

  socket.on("ko", (payload) => {
    console.log(`${payload.player} was knocked out!`);
  });
});
