const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless')
const githubApp = require('./src/github/app')
const slackApp = require('./src/slack/app')

module.exports = {
  github: createLambdaFunction(githubApp, { probot: createProbot() }),
  slack: async (event, context, callback) => {
    const handler = await slackApp.start()
    return handler(event, context, callback)
  }
}
