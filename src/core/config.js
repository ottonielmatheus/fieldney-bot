require('dotenv').config()

module.exports = {
  appId: process.env.APP_ID,
  privateKeyPath: process.env.PRIVATE_KEY_PATH,
  webhookSecret: process.env.WEBHOOK_SECRET,
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG
  }
}
