const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless')
const trelloHandler = require('./src/trello/structures/TrelloHandler')
const githubApp = require('./src/github/app')
const slackApp = require('./src/slack/app')
const trelloApp = require('./src/trello/app')

module.exports = {
  trello: trelloHandler.handleApp(trelloApp),
  github: createLambdaFunction(githubApp, { probot: createProbot() }),
  slack: async (event, context, callback) => {
    const handler = await slackApp.start()
    return handler(event, context, callback)
  }
}
