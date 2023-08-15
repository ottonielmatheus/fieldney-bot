const { getFieldnewsSuggestion, getFieldnewsTopics } = require('../tasks')

const requestReviewAndAssignAuthor = async ({ githubApi, repository, pullRequest }) => {
  const repositoryTeams = await githubApi.getRepoTeams(repository.name)
  githubApi.assignPRTo(pullRequest.number, [pullRequest.user.login])
  githubApi.addRepoTeamsReviewers(pullRequest.number, repositoryTeams)
}

const suggestFieldnews = async ({ githubApi, repository, pullRequest }) => {
  if (!pullRequest.is_draft) {
    const [firstClosedIssue] = await githubApi.getClosedIssuesNumberByPR(pullRequest.number)
    if (!firstClosedIssue) {
      return githubApi.addOrUpdatePRComment(pullRequest.number,
        `Oi ${pullRequest.user.login}, vincula a issue que esse PR resolve que eu faço um fieldnews monstro pra você! 😉\n` +
        'Só lembrando que caso esse PR resolva mais de uma issue, na hora de escrever o fieldnews,' +
        'eu irei considerar somente a primeira que foi vinculada, ok?'
      )
    }

    const closedIssue = await githubApi.getIssue(firstClosedIssue.number)
    const { context, implementation, motivation } = getFieldnewsTopics(repository.description, pullRequest.body, closedIssue.body)
    if (!context || !implementation || !motivation) {
      let missingItensComment = `@${pullRequest.user.login}, só ta faltando as seguintes informações para eu montar um fieldnews:\n\n`
      if (!context) missingItensComment += ' - **Contexto**: A descrição desse repositório é o contexto, verifique se esse repositório possui uma\n'
      if (!implementation) missingItensComment += ' - **Implementações**: No PR, precisa ser informado dentro de `<implementation></implementation>`\n'
      if (!motivation) missingItensComment += ' - **Motivação**: Na issue que esse PR fecha, escreva logo no começo, e separe do resto por dois `enter`\n'
      return githubApi.addOrUpdatePRComment(pullRequest.number, missingItensComment)
    }

    const suggestion = await getFieldnewsSuggestion(context, implementation, motivation, pullRequest.user)
    await githubApi.addOrUpdatePRComment(pullRequest.number, suggestion, 'Sugestão de Fieldnews')
  }
}

const notifyHotfix = async ({ slackApi, repository, pullRequest }) => {
  const author = pullRequest.user.name || pullRequest.user.login
  const message = `<!channel>, *${author}* acabou de subir uma *hotfix* para o *${repository.name}*, ` +
    'precisamos de review urgente! 🔥🚒\n' + pullRequest.html_url
  await slackApi.chat.postMessage({ channel: 'developers', text: message })
}

const notifyReadyForMerge = async ({ db, slackApi, pullRequest }) => {
  const user = await db.table('users').read({ github_login: pullRequest.user.login })
  if (user) {
    const message = `Seu PR — *${pullRequest.title}* está pronto para ser publicado. 🚀\n` + pullRequest.html_url
    await slackApi.chat.postMessage({ channel: user.slack_id, text: message })
  }
}

const notifyReproved = async ({ db, slackApi, review, pullRequest }) => {
  const user = await db.table('users').read({ github_login: pullRequest.user.login })
  if (user) {
    const message = `Seu PR — *${pullRequest.title}* foi reprovado por *${review.user.login}*.\n` + pullRequest.html_url
    await slackApi.chat.postMessage({ channel: user.slack_id, text: message })
  }
}

module.exports = {
  requestReviewAndAssignAuthor,
  suggestFieldnews,
  notifyHotfix,
  notifyReadyForMerge,
  notifyReproved
}
