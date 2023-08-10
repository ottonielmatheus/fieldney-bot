const format = require('./../tools/formatter')

class GitHub {
  constructor ({ org, owner, repository, octokit }) {
    this.owner = owner
    this.repo = repository
    this.org = org
    this.octokit = octokit
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

  async getProjectItems (projectQuery) {
    const { organization } = await this.octokit.graphql(`
      query ($org: String!, $projectQuery: String) {
        organization (login: $org) {
          projectsV2 (first: 1, query: $projectQuery) {
            nodes {
              title
              items (first: 20) {
                nodes {
                  content {
                    ... on DraftIssue {
                      title
                      assignees (first: 5) {
                        nodes {
                          name
                          login
                        }
                      }
                    }
                    ... on Issue {
                      title
                      labels (first: 5) {
                        nodes {
                          name
                        }
                      }
                      assignees (first: 5) {
                        nodes {
                          name
                          login
                        }
                      }
                    }
                  }
                  status: fieldValueByName (name: "Status") {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      description
                    }
                  }
                }
              }
            }
          }
        }
      }`, { org: this.org.login, projectQuery })

    const [project] = organization.projectsV2.nodes
    if (!project) {
      return null
    }
    return format.project(project)
  }

  async getProjects () {
    const { organization } = await this.octokit.graphql(`
      query ($org: String!) {
        organization (login: $org) {
          projectsV2 (first: 20) {
            nodes {
              title
            }
          }
        }
      }`, { org: this.org.login })
    return organization.projectsV2.nodes
  }

  async getCommit (commitRef) {
    const { data } = await this.octokit.repos.getCommit({ owner: this.owner.login, repo: this.repo.name, ref: commitRef })
    return data
  }
}

module.exports = GitHub
