const { ProbotOctokit } = require('probot')

class GitHub {
  constructor (organization, owner, repository, octokit) {
    this.octokit = octokit || new ProbotOctokit()
    this.owner = owner
    this.repo = repository
    this.org = organization
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
      }`, { owner: this.owner.login, name: this.repo.name, prNumber })
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
    `, { owner: this.owner.login, name: this.repo.name, issueNumber })
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
      }`, { owner: this.owner.login, name: this.repo.name, prNumber })
    return repository.pullRequest.comments.nodes
  }

  async getRepoTeams (repoName) {
    const { organization } = await this.octokit.graphql(`
      query ($org: String!, $repoName: String!) {
        organization (login: $org) {
          teams (first: 20) {
            nodes {
              name
              repositories (query: $repoName) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }`, { org: this.org.login, repoName })
    return organization.teams.nodes.map(team => team.name)
  }

  async addOrUpdatePRComment (prNumber, text, where) {
    const comments = await this.getPullRequestComments(prNumber)
    const existingComment = comments.find(comment =>
      comment.author.login === 'fieldney-bot' && comment.body.includes(where)
    )

    if (existingComment) {
      return this.octokit.issues.updateComment({
        repo: this.repo.name,
        owner: this.owner.login,
        comment_id: existingComment.databaseId,
        body: text
      })
    }
    return this.octokit.issues.createComment({
      repo: this.repo.name,
      owner: this.owner.login,
      issue_number: prNumber,
      body: text
    })
  }

  async assignPRTo (prNumber, users) {
    return this.octokit.issues.addAssignees({
      repo: this.repo.name,
      owner: this.owner.login,
      issue_number: prNumber,
      assignees: users
    })
  }

  async addRepoTeamsReviewers (prNumber, teams) {
    return this.octokit.pulls.requestReviewers({
      repo: this.repo.name,
      owner: this.owner.login,
      pull_number: prNumber,
      team_reviewers: teams
    })
  }
}

module.exports = GitHub
