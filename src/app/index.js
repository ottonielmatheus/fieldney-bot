const pullRequests = require('./pull-requests')

module.exports = (app) => {
  app.on(['pull_request.opened', 'pull_request.edited'], pullRequests.suggestFieldNews)

  app.onError(async (err) => {
    app.log.error(err)
    // add sentry here :)
  })
}
