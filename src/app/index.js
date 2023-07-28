const GithubApi = require('../core/integrations/github')
const pulls = require('./pull-requests')

function middleware (cb) {
  return (context) => {
    const { organization, repository } = context.payload
    const githubApi = new GithubApi(organization, repository.owner, repository, context.octokit)
    context = { githubApi, ...context }
    return cb(context)
  }
}

module.exports = (app) => {
  app.on('pull_request.opened', middleware(async context => {
    await pulls.requestReviewAndAssignAuthor(context)
    await pulls.suggestFieldnews(context)
  }))

  app.on('pull_request.edited', middleware(async context => {
    if (context.action === 'labeled') {
      // check label and if 'hotfix' send to slack
    }
    await pulls.suggestFieldnews(context)
  }))

  app.onError(async (err) => {
    app.log.error(err)
    // add sentry here :)
  })
}
