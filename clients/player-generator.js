'use strict';

class Player {
  constructor(faker) {
    this.health = 10;
    this.player = faker.internet.userName();
    this.catchphrase = "Welcome to FLAVORTOWN!";
    this.roomName = '';
  }

}

module.exports = Player