require('dotenv').config()

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
  }
}
