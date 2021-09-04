'use strict';

const faker = require('faker');


class Player {
  constructor() {
    this.health = 10,
    this.player = faker.internet.userName(),
    this.catchphrase = "Welcome to FLAVORTOWN!"
  }

}

module.exports = Player