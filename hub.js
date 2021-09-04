const port = process.env.PORT;
const io = require("socket.io")(port);

const pokeHub = io.of("/pokehub");

//start it up!!!
pokeHub.emit("create-player");

pokeHub.on("connection", (socket) => {
  console.log("global", socket.id);
  //join clients to a room when they connect
  socket.on("join", (payload) => {
    console.log(`${payload.player} joined`);
    socket.join("fightroom");
    const output = `${payload.player} is ready to fight!`;
    pokeHub.to("fightroom").emit("joined", output);
  });

  socket.on("quick-attack", (payload) => {
    //   let damage = payload.move.damage
    console.log("quick attack");

    const output = {
      damage: damage,
      message: "You were hit with a quick attack!",
    };
    //emits to just the other player
    socket.to("fightroom").emit("quick-attack", output);
  });

  socket.on("heavy-attack", (payload) => {
    //   let damage = payload.move.damage
    console.log("heavy attack");

    const output = {
      damage: damage,
      message: "You were hit with a heavy attack!",
    };
    //emits to just the other player
    socket.to("fightroom").emit("heavy-attack", output);
  });

  socket.on("heal-self", (payload) => {
    let player = payload.player;
    console.log(`${player} used heal-self!`);
  });

  socket.on("ko", (payload) => {
    console.log(`${payload.player} was knocked out!`);
  });
});
