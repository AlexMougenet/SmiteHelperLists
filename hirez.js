const Smite = require('./src/smite/smiteAPI')

class Hirez {
  constructor (args) {
    this.devId = args.devId
    this.authKey = args.authKey
  }

  smite (platform) {
    return new Smite(this, platform)
  }

}

module.exports = Hirez
