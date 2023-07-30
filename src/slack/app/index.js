const { slackApp, awsLambdaReceiver } = require('../../core/integrations/slack')

slackApp.message('oi', async ({ message, say }) => {
  await say({ text: 'Olá Fielder!' })
})

module.exports = awsLambdaReceiver
