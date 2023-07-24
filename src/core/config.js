require('dotenv').config()

module.exports = {
  appId: process.env.APP_ID,
  privateKeyPath: process.env.PRIVATE_KEY_PATH,
  webhookSecret: process.env.WEBHOOK_SECRET
}
