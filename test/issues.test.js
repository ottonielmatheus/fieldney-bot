const nock = require('nock')
const app = require('../src/app')
const { Probot, ProbotOctokit } = require('probot')
const payload = require('./fixtures/issues.opened')

describe('Test "issues" events', () => {
  let probot

  beforeEach(() => {
    nock.disableNetConnect()
    probot = new Probot({
      githubToken: 'test',
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false }
      })
    })
    app(probot)
  })

  test('issues.opened', async () => {
    nock('https://api.github.com')
      .post('/app/installations/1/access_tokens')
      .reply(200, { token: 'test' })

    nock('https://api.github.com')
      .post('/repos/ottonielmatheus/fieldney-bot/issues/1/comments', (body) => {
        expect(body).toMatchObject({ body: 'Hello, World!' })
        return true
      })
      .reply(200)

    await probot.receive({ name: 'issues.opened', payload })
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})
