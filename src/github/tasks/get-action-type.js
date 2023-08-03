module.exports = (actionTitle) => {
  const types = {
    deploy: ['continuous integration/deployment', 'ci/cd', 'ci-cd'],
    fieldnews: ['fieldnews']
  }
  for (const type in types) {
    const titleMatchs = types[type].some(title => actionTitle.toLowerCase().includes(title))
    if (titleMatchs) return type
  }
}
