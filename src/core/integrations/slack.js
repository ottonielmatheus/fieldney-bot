const { App, AwsLambdaReceiver } = require('@slack/bolt')
const config = require('../config')

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: config.slack.signingSecret
})

const slackApp = new App({
  token: config.slack.token,
  receiver: awsLambdaReceiver
})

module.exports = { slackApp, awsLambdaReceiver }
