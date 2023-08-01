const { groupBy } = require('lodash')
const filterItemsByStatus = require('../tasks/filter-items-by-status')

const getProjectStatus = async ({ githubApi, command, say }) => {
  let [projectQuery, ...statusQuery] = command.text.split(' ')
  if (statusQuery) {
    statusQuery = statusQuery.join(' ')
  }

  const project = await githubApi.getProjectItems(projectQuery)
  if (!project) {
    return say({ text: `Desculpe, não encontrei nenhum projeto com o nome "${projectQuery}"` })
  }

  let reply = statusQuery ? `Aqui estão os items \`${statusQuery}\` ` : 'Aqui estão todos os itens '
  reply += `que encontrei para *${project.title}*: \n\n`

  const itemsByStatus = groupBy(project.items, 'status.value')
  const filteredStatus = filterItemsByStatus(itemsByStatus, statusQuery)

  for (const status of filteredStatus) {
    reply += `*${status}:* \n\n`

    for (const item of itemsByStatus[status]) {
      const type = {
        bug: '🐛 Correção:',
        fix: '🐛 Correção:',
        hotfix: '🔥 Correção:',
        feature: '🎸 Melhoria:',
        refactor: '💡 Atualização:',
        chore: '🤖 Atualização:'
      }[item.type.value?.toLowerCase()] || ''

      reply += '  -  '
      reply += type ? `*${type}* ` : ''
      reply += `${item.title} `
      reply += item.assignees.length ? `(${item.assignees.join(', ')})\n` : '\n'
    }

    reply += '\n\n'
  }

  await say({ text: reply })
}

module.exports = {
  getProjectStatus
}
