const TrelloApp = require('../structures/TrelloApp')
const app = new TrelloApp()

app.on('updateCard.moved', async ({ trelloApi, githubApi, data }) => {
  console.log(data)
})

module.exports = app
