const GithubApi = require('../core/integrations/github')
const getFieldnewsSuggestion = require('../tasks/get-fieldnews-suggest')

const suggestFieldNews = async ({ octokit, payload }) => {
  const { repository, pull_request: pullRequest } = payload
  const githubApi = new GithubApi(repository.owner, repository.name, octokit)

  if (!pullRequest.is_draft) {
    const [firstClosedIssue] = await githubApi.getClosedIssuesNumberByPR(pullRequest.number)
    const closedIssue = await githubApi.getIssue(firstClosedIssue.number)

    const suggestion = await getFieldnewsSuggestion(repository.description, pullRequest.body, closedIssue.body)
    const comment = 'Sugestão de Fieldnews \n' +
      '------------ \n' +
      'Olá Dev, aqui vai uma sugestão de Fieldnews gerada pela **IA**.' +
      'Não se esqueça de revisar! 🚀 \n\n' + suggestion

    await githubApi.commentOnPullRequest(pullRequest.number, comment)
  }
}

module.exports = {
  suggestFieldNews
}
