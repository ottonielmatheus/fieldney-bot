const { getFieldnewsSuggestion, getFieldnewsTopics } = require('../tasks')

const requestReviewAndAssignAuthor = async ({ githubApi, payload }) => {
  const { repository, pull_request: pullRequest } = payload

  const repositoryTeams = await githubApi.getRepoTeams(repository.name)
  githubApi.assignPRTo(pullRequest.number, [pullRequest.user.login])
  githubApi.addRepoTeamsReviewers(pullRequest.number, repositoryTeams)
}

const suggestFieldnews = async ({ githubApi, payload }) => {
  const { repository, pull_request: pullRequest } = payload

  if (!pullRequest.is_draft) {
    const [firstClosedIssue] = await githubApi.getClosedIssuesNumberByPR(pullRequest.number)
    if (!firstClosedIssue) {
      return githubApi.addOrUpdatePRComment(pullRequest.number,
        `Oi **@${pullRequest.user.login}**, vincula a issue que esse PR resolve que eu faço um fieldnews monstro pra você! 😉\n` +
        'Só lembrando que caso esse PR resolva mais de uma issue, na hora de escrever o fieldnews,' +
        'eu irei considerar somente a primeira que foi vinculada, ok?'
      )
    }

    const closedIssue = await githubApi.getIssue(firstClosedIssue.number)
    const { context, implementation, motivation } = getFieldnewsTopics(repository.description, pullRequest.body, closedIssue.body)
    if (!context || !implementation || !motivation) {
      return githubApi.addOrUpdatePRComment(pullRequest.number,
        `**@${pullRequest.user.login}**, só ta faltando as seguintes informações para eu montar um fieldnews:\n\n` +
        (!context ? ' - **Contexto**: Eu considero a descrição desse repositório como o contexto, verifica se esse repositório possui uma\n' : '\n') +
        (!implementation ? ' - **Implementações**: Essa daqui eu pego aqui mesmo, no PR, precisa ser informado dentro de `<implementation></implementation>`\n' : '\n') +
        (!motivation ? ' - **Motivação**: Deve ser escrita na issue que esse PR ta fechando, escreva logo no começo, e separe do resto por dois `enter`\n' : '\n')
      )
    }

    const comment = await getFieldnewsSuggestion(context, implementation, motivation, pullRequest.user)
    await githubApi.addOrUpdatePRComment(pullRequest.number, comment, 'Sugestão de Fieldnews')
  }
}

module.exports = {
  requestReviewAndAssignAuthor,
  suggestFieldnews
}
