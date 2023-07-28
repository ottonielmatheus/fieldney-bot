const { createLambdaFunction, createProbot } = require('@probot/adapter-aws-lambda-serverless')
const appFn = require('./src/app')

module.exports = {
  github: createLambdaFunction(appFn, { probot: createProbot() })
}
