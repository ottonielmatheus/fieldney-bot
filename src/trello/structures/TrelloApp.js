const GithubApi = require('../../core/integrations/github')
const trelloApi = require('../../core/integrations/trello')

class TrelloApp {
  constructor () {
    this.watchers = []
  }

  async on (event, callback) {
    this.watchers[event] = callback
  }

  async execute (actionType, body) {
    const githubApi = new GithubApi({})
    const handler = this.watchers[actionType]
    if (typeof handler === 'function') {
      return handler({ trelloApi, githubApi, ...body })
    }
  }
}

module.exports = TrelloApp
