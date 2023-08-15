const TrelloApi = require('trello-node-api')
const config = require('../config')

const trelloApi = new TrelloApi()
trelloApi.setApiKey(config.trello.key)
trelloApi.setOauthToken(config.trello.token)

module.exports = trelloApi
