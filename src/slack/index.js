const { slackApp } = require('../core/integrations/slack')

slackApp.start(process.env.PORT || 4000)
console.log('⚡️ Bolt app is running!')
