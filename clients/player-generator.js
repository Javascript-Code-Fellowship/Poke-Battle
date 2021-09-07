'use strict';

class Player {
  constructor(name, catchphrase) {
    this.health = 10;
    this.player = name;
    this.catchphrase = catchphrase;
  }
}

module.exports = Player;
