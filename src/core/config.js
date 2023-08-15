const path = require('path')
const environment = process.env.ENVIRONMENT || 'dev'
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.' + environment) })

module.exports = {
  github: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
    installationId: process.env.GITHUB_INSTALLATION_ID,
    orgName: process.env.GITHUB_ORG_NAME
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
  aws: {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: environment !== 'prod' ? process.env.AWS_ENDPOINT : null
  },
  env: environment
}
