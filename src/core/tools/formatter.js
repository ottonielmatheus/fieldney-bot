module.exports = {
  project: (project) => {
    const getAssigneeName = (assignee) => assignee.name || assignee.login
    return {
      title: project.title,
      items: project.items?.nodes.map(item => ({
        title: item.content.title,
        labels: item.content.labels?.nodes.map(label => label.name) || [],
        status: {
          value: item.status?.name,
          description: item.status?.description
        },
        assignees: item.content.assignees.nodes.map(getAssigneeName)
      })) || []
    }
  }
}
