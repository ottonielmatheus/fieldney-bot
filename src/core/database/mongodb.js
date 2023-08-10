const { MongoClient, ServerApiVersion } = require('mongodb')
const config = require('../config')

class MongoDB {
  constructor (uri, options) {
    this.client = new MongoClient(uri, options)
  }

  async connect () {
    await this.client.connect()
    this.db = this.client.db(config.databases.mongodb.dbName)
  }

  async close () {
    await this.client.close()
  }

  async tx (callback) {
    try {
      await this.connect()
      return await callback(this.db)
    } finally {
      await this.close()
    }
  }
}

module.exports = new MongoDB(config.databases.mongodb.uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
