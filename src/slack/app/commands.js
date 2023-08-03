const { groupBy } = require('lodash')
const tasks = require('./../tasks')

const getProjectStatus = async ({ githubApi, command, say }) => {
  let [projectQuery, ...statusQuery] = command.text.split(' ')
  if (statusQuery) {
    statusQuery = statusQuery.join(' ')
  }

  const project = await githubApi.getProjectItems(projectQuery)
  if (!project) {
    const projects = await githubApi.getProjects()

    let reply = `Desculpe, não encontrei nenhum projeto com o nome _${projectQuery}_, mas você pode tentar alguns destes:\n\n`
    reply += projects.map(project => `  • ${project.title}`).join('\n')

    return say({ text: reply })
  }

  const itemsByStatus = groupBy(project.items, 'status.value')
  const filteredStatus = tasks.filterItemsByStatus(itemsByStatus, statusQuery)

  let reply = statusQuery ? `Aqui estão os items \`${statusQuery}\` ` : 'Aqui estão todos os itens '
  reply += `que encontrei para _${project.title}_: \n\n`

  for (const status of filteredStatus) {
    reply += `*${status}:* \n\n`

    for (const item of itemsByStatus[status]) {
      const type = tasks.getTypeEmoji(item.labels)

      reply += '  •  '
      reply += type ? `*${type}*: ` : ''
      reply += `${item.title} `
      reply += item.assignees.length ? `(${item.assignees.join(', ')})` : ''
      reply += '\n'
    }

    reply += '\n\n'
  }

  await say({ text: reply })
}

module.exports = {
  getProjectStatus
}
