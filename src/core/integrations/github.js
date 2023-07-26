const { ProbotOctokit } = require('probot')

class GitHub {
  constructor (owner, repository, octokit) {
    this.octokit = octokit || new ProbotOctokit()
    this.owner = owner
    this.repo = repository
  }

  async getClosedIssuesNumberByPR (prNumber) {
    const { repository } = await this.octokit.graphql(`
      query ($owner: String!, $name: String!, $prNumber: Int!) {
        repository (owner: $owner, name: $name) {
          pullRequest (number: $prNumber) {
            closingIssuesReferences (first: 5) {
              nodes {
                number
              }
            }
          }
        }
      }`, { owner: this.owner.login, name: this.repo, prNumber })
    return repository.pullRequest.closingIssuesReferences.nodes
  }

  async getIssue (issueNumber) {
    const { repository } = await this.octokit.graphql(`
      query ($owner: String!, $name: String!, $issueNumber: Int!) {
        repository (owner: $owner, name: $name) {
          issue (number: $issueNumber) {
            title
            body
          }
        }
      }
    `, { owner: this.owner.login, name: this.repo, issueNumber })
    return repository.issue
  }

  async getPullRequestComments (prNumber) {
    const { repository } = await this.octokit.graphql(`
      query ($owner: String!, $name: String!, $prNumber: Int!) {
        repository (owner: $owner, name: $name) {
          pullRequest (number: $prNumber) {
            comments (first: 10) {
              nodes {
                databaseId
                body
                author {
                  login
                }
              }
            }
          }
        }
      }`, { owner: this.owner.login, name: this.repo, prNumber })
    return repository.pullRequest.comments.nodes
  }

  async commentOnPullRequest (prNumber, text) {
    const comments = await this.getPullRequestComments(prNumber)
    const botComment = comments.find(comment => comment.author.login === 'fieldney-bot')

    if (botComment) {
      return this.octokit.issues.updateComment({
        repo: this.repo,
        owner: this.owner.login,
        comment_id: botComment.databaseId,
        body: text
      })
    }
    return this.octokit.issues.createComment({
      repo: this.repo,
      owner: this.owner.login,
      issue_number: prNumber,
      body: text
    })
  }
}

module.exports = GitHub
