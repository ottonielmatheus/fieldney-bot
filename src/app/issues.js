const onOpened = async (context) => {
  const issueComment = context.issue({ body: 'Hello, World!' })
  try {
    return context.octokit.issues.createComment(issueComment)
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  onOpened
}
