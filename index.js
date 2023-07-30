const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless')
const { awsLambdaReceiver } = require('./src/core/integrations/slack')
const appFn = require('./src/github/app')

module.exports = {
  github: createLambdaFunction(appFn, { probot: createProbot() }),
  slack: async (event, context, callback) => {
    const handler = await awsLambdaReceiver.start()
    return handler(event, context, callback)
  }
}
