const GitHubApi = require('./../../core/integrations/github')
const { ProbotOctokit } = require('probot')
const config = require('./../../core/config')
const { slackApp, awsLambdaReceiver } = require('../../core/integrations/slack')
const commands = require('./commands')

const middleware = (cb) => {
  const octokit = new ProbotOctokit({
    auth: {
      appId: config.github.appId,
      installationId: config.github.installationId,
      privateKey: Buffer.from(config.github.privateKey, 'base64').toString()
    }
  })
  const githubApi = new GitHubApi({ org: { login: config.github.orgName }, octokit })

  return (context) => {
    context.githubApi = githubApi
    return cb(context)
  }
}

slackApp.message('oi fieldney', middleware(async ({ message, say }) => {
  await say({ text: 'Olá Fielder!' })
}))

slackApp.command('/board', middleware(async (context) => {
  await context.ack()
  await commands.getProjectStatus(context)
}))

module.exports = awsLambdaReceiver
