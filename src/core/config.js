require('dotenv').config()

module.exports = {
  github: {
    appId: process.env.APP_ID,
    privateKeyPath: process.env.PRIVATE_KEY_PATH,
    webhookSecret: process.env.WEBHOOK_SECRET
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG
  },
  slack: {
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
  }
}
