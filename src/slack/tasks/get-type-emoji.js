module.exports = (labels) => {
  const containsLabel = label => labels.includes(label)
  const types = [
    { text: '🔥 Correção', value: ['hotfix'].some(containsLabel) },
    { text: '🐛 Correção', value: ['bug', 'fix'].some(containsLabel) },
    { text: '🎸 Melhoria', value: ['feat'].some(containsLabel) },
    { text: '💡 Atualização', value: ['refactor'].some(containsLabel) },
    { text: '🤖 Atualização', value: ['chore'].some(containsLabel) },
    { text: '📝 Draft', value: true }
  ]

  return types.find(type => type.value)?.text
}
