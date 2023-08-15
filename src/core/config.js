const path = require('path')
const environment = process.env.ENVIRONMENT || 'dev'
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.' + environment) })

module.exports = {
  github: {
    appId: process.env.APP_ID,
    privateKey: process.env.PRIVATE_KEY,
    webhookSecret: process.env.WEBHOOK_SECRET,
    installationId: process.env.INSTALLATION_ID,
    orgName: process.env.GH_ORG_NAME
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG
  },
  slack: {
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  },
  trello: {
    key: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_API_TOKEN,
    secret: process.env.TRELLO_SECRET
  },
  databases: {
    mongodb: {
      uri: process.env.MONGODB_URI,
      dbName: process.env.MONGODB_DB_NAME
    }
  }
}
