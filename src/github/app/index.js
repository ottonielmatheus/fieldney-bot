const { mapKeys, camelCase } = require('lodash')
const GithubApi = require('../../core/integrations/github')
const { slackApp } = require('../../core/integrations/slack')
const pulls = require('./pull-requests')
const tasks = require('../tasks')

function middleware (cb) {
  const slackApi = slackApp.client

  return (context) => {
    const { organization, repository } = context.payload
    const githubApi = new GithubApi({
      org: organization,
      owner: repository.owner,
      octokit: context.octokit,
      repository
    })
    const payload = mapKeys(context.payload, (val, key) => camelCase(key))
    context = { slackApi, githubApi, ...payload }
    return cb(context)
  }
}

module.exports = (app) => {
  app.on('pull_request.opened', middleware(async context => {
    await pulls.requestReviewAndAssignAuthor(context)
    await pulls.suggestFieldnews(context)
  }))

  app.on('pull_request.edited', middleware(async context => {
    await pulls.suggestFieldnews(context)
  }))

  app.on('pull_request.labeled', middleware(async context => {
    if (context.label.name === 'hotfix') {
      await pulls.notifyHotfix(context)
    }
  }))

  app.on('workflow_run.completed', middleware(async context => {
    const { workflowRun } = context
    const actionType = tasks.getActionType(workflowRun.name)

    if (actionType === 'deploy' && workflowRun.conclusion === 'success') {
      if (workflowRun.head_branch === 'master') {
        await pulls.notifyDeploy(context)
      }
      if (workflowRun.head_branch === 'preview') {
        await pulls.notifyPreviewUse(context)
      }
    }
  }))

  app.onError(async (err) => {
    app.log.error(err)
    // add sentry here :)
  })
}
