const mongodb = require('./../../core/database/mongodb')
const GitHubApi = require('./../../core/integrations/github')
const { slackApp, awsLambdaReceiver } = require('../../core/integrations/slack')
const commands = require('./commands')

const middleware = (cb) => {
  const githubApi = new GitHubApi({})
  return async (context) => {
    return await mongodb.tx(async (db) => {
      context.db = db
      context.githubApi = githubApi
      return await cb(context)
    })
  }
}

slackApp.message('oi @fieldney', middleware(async ({ say }) => {
  await say({ text: 'Olá Fielder!' })
}))

slackApp.command('/board', middleware(async (context) => {
  await context.ack()
  await commands.getProjectStatus(context)
}))

slackApp.command('/iam', middleware(async (context) => {
  await context.ack()
  await commands.assignAccount(context)
}))

slackApp.command('/whoami', middleware(async (context) => {
  await context.ack()
  await commands.showLinkedAccounts(context)
}))

module.exports = awsLambdaReceiver
