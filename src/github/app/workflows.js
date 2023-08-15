const notifyDeployToChannel = async ({ slackApi, workflowRun }) => {
  const [title] = workflowRun.head_commit.message.split('\n\n').reverse()
  const author = workflowRun.triggering_actor.login

  const message = `<!channel>, *${author}* acabou de publicar — *${title}*, vamos verificar se está tudo ok? 🚀`
  await slackApi.chat.postMessage({ channel: 'suporte', text: message })
}

const notifyPreviewUseToChannel = async ({ slackApi, repository, workflowRun }) => {
  const [title] = workflowRun.head_commit.message.split('\n\n').reverse()
  const author = workflowRun.triggering_actor.login

  const message = `<!channel>, *${author}* está usando \`preview\` de *${repository.name}* para testar — ${title}! 👷`
  await slackApi.chat.postMessage({ channel: 'developers', text: message })
}

const notifyDeployToAuthor = async ({ db, slackApi, githubApi, workflowRun }) => {
  const [title] = workflowRun.head_commit.message.split('\n\n').reverse()
  const commit = await githubApi.getCommit(workflowRun.head_sha)

  const user = await db.table('users').read({ github_login: commit.author.login })
  if (user) {
    const message = `Seu PR — *${title}* acabou de ser publicado, bora verificar se está tudo ok? 💙`
    await slackApi.chat.postMessage({ channel: user.slack_id, text: message })
  }
}

module.exports = {
  notifyDeployToChannel,
  notifyPreviewUseToChannel,
  notifyDeployToAuthor
}
