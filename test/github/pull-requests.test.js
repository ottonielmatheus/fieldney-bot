const nock = require('nock')
const { Probot, ProbotOctokit } = require('probot')
const app = require('../../src/github/app')
const payload = require('../fixtures/payloads/pull-requests.opened.json')
const labeledPayload = require('../fixtures/payloads/pull-requests.labeled.json')
const orgTeamsResponse = require('../fixtures/responses/org-teams.json')
const prClosedIssuesResponse = require('../fixtures/responses/pull-requets-closed-issues.json')
const issueResponse = require('../fixtures/responses/issue.json')
const fieldnewsSuggestionResponse = require('../fixtures/responses/fieldnews-suggestions.json')
const pullRequestCommentsResponse = require('../fixtures/responses/pull-request-comments.json')

describe('Test "pull requests" events', () => {
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

  test('on pull_request opened', async () => {
    nock('https://api.github.com')
      .post('/graphql', (body) => {
        expect(body).toMatchObject({
          query: '\n' +
            '      query ($org: String!, $repoName: String!) {\n' +
            '        organization (login: $org) {\n' +
            '          teams (first: 20) {\n' +
            '            nodes {\n' +
            '              name\n' +
            '              repositories (query: $repoName) {\n' +
            '                nodes {\n' +
            '                  name\n' +
            '                }\n' +
            '              }\n' +
            '            }\n' +
            '          }\n' +
            '        }\n' +
            '      }',
          variables: {
            org: 'this-is-just-a-test-org',
            repoName: 'fieldney-bot'
          }
        })
        return true
      })
      .reply(200, orgTeamsResponse)

    nock('https://api.github.com')
      .post('/repos/ottonielmatheus/fieldney-bot/issues/9/assignees', (body) => {
        expect(body).toMatchObject({ assignees: ['ottonielmatheus'] })
        return true
      })
      .reply(201)

    nock('https://api.github.com')
      .post('/repos/ottonielmatheus/fieldney-bot/pulls/9/requested_reviewers', (body) => {
        expect(body).toMatchObject({ team_reviewers: ['Backoffice'] })
        return true
      })
      .reply(201)

    nock('https://api.github.com')
      .post('/graphql', (body) => {
        expect(body).toMatchObject({
          query: '\n' +
          '      query ($owner: String!, $name: String!, $prNumber: Int!) {\n' +
          '        repository (owner: $owner, name: $name) {\n' +
          '          pullRequest (number: $prNumber) {\n' +
          '            closingIssuesReferences (first: 5) {\n' +
          '              nodes {\n' +
          '                number\n' +
          '              }\n' +
          '            }\n' +
          '          }\n' +
          '        }\n' +
          '      }',
          variables: {
            owner: 'ottonielmatheus',
            name: 'fieldney-bot',
            prNumber: 9
          }
        })
        return true
      })
      .reply(200, prClosedIssuesResponse)

    nock('https://api.github.com')
      .post('/graphql', (body) => {
        expect(body).toMatchObject({
          query: '\n' +
          '      query ($owner: String!, $name: String!, $issueNumber: Int!) {\n' +
          '        repository (owner: $owner, name: $name) {\n' +
          '          issue (number: $issueNumber) {\n' +
          '            title\n' +
          '            body\n' +
          '          }\n' +
          '        }\n' +
          '      }\n' +
          '    ',
          variables: {
            owner: 'ottonielmatheus',
            name: 'fieldney-bot',
            issueNumber: 5
          }
        })
        return true
      })
      .reply(200, issueResponse)

    nock('https://api.openai.com:443')
      .post('/v1/completions', (body) => {
        expect(body).toMatchObject({
          prompt: 'Comunique um e-mail descolado de uma alteração no código,\n' +
            'com descrição que deve ser explicativa para o público em geral.\n' +
            '\n' +
            'Será enviado para funcionários internos da empresa Field Control.\n' +
            'Onde usamos "Fielders" para nos referirmos aos funcionários da empresa.\n' +
            '\n' +
            'Deve possuir os seguintes tópicos separados:\n' +
            '\n' +
            'Tópico "**Contexto**", onde o contexto é:\n' +
            'Como "Issue description" afeta "Repository description".\n' +
            '\n' +
            'Tópico "**Motivações**", onde as motivações para essas implementações foram:\n' +
            '(Melhore esse texto: "Issue description")\n' +
            '\n' +
            'Tópico "**Implementação**", onde as implementações são:\n' +
            '(melhore esse texto: "Pull request description")\n' +
            '\n' +
            'E adicione um último tópico "Evoluções" apresentando as evoluções que essas implementações implicam.<END>',
          model: 'text-davinci-003',
          temperature: 1,
          max_tokens: 524,
          stop: '<END>'
        })
        return true
      })
      .reply(200, fieldnewsSuggestionResponse)

    nock('https://api.github.com')
      .post('/graphql', (body) => {
        expect(body).toMatchObject({
          query: '\n' +
          '      query ($owner: String!, $name: String!, $prNumber: Int!) {\n' +
          '        repository (owner: $owner, name: $name) {\n' +
          '          pullRequest (number: $prNumber) {\n' +
          '            comments (first: 10) {\n' +
          '              nodes {\n' +
          '                databaseId\n' +
          '                body\n' +
          '                author {\n' +
          '                  login\n' +
          '                }\n' +
          '              }\n' +
          '            }\n' +
          '          }\n' +
          '        }\n' +
          '      }',
          variables: {
            owner: 'ottonielmatheus',
            name: 'fieldney-bot',
            prNumber: 9
          }
        })
        return true
      })
      .reply(200, pullRequestCommentsResponse)

    nock('https://api.github.com')
      .post('/repos/ottonielmatheus/fieldney-bot/issues/9/comments', (body) => {
        expect(body).toMatchObject({
          body: 'Sugestão de Fieldnews \n' +
            '------------ \n' +
            'Salve **@ottonielmatheus**! Aqui vai uma sugestão de Fieldnews quentinha que eu gerei pra você. 💙\n' +
            'Não se esqueça de revisar! 🚀 \n' +
            '\n' +
            'Assunto: Atualizações da Base de Código da Field Control\n' +
            '\n' +
            'Prezados Fielders,\n' +
            '\n' +
            'Estamos empolgados para compartilhar as mais recentes atualizações na Base de Código da Field Control. Estamos expandindo nosso sistema para melhorar a produtividade de nossos usuários e nos aproximar aos nossos objetivos de negócios.\n' +
            '\n' +
            'Contexto:\n' +
            '\n' +
            'Estamos fazendo uma atualização no repositório de código da Field Control. Esta atualização é para permitir que o código seja reutilizado por outros usuários. Estes recursos permitirão que os Fielders criem uma documentação clara e eficiente, bem como fornecer um código mais otimizado para uso futuro.\n' +
            '\n' +
            'Motivações:\n' +
            '\n' +
            'Estamos atualizando o repositório de código da Field Control para melhorar a facilidade de uso e introspecção dos nossos recursos. Estas mudanças nos permitirão desenvolver novos recursos de maneira mais ágil e ter os melhores padrões de código possíveis.\n' +
            '\n' +
            'Implementação:\n' +
            '\n' +
            'Estamos fazendo commit em uma nova versão do repositório da Field Control. Devemos garantir que o código atual seja refatorado e melhorado com novas ferramentas. Desse modo, deverá ser mais intuitivo para os desenvolvedores trabalharem com ele e permitirá que novas iteratividades sejam realizadas de forma mais rápida.\n' +
            '\n' +
            'Evolução:\n' +
            '\n' +
            'Esta implementação melhorará significativamente a facilidade de uso e a qualidade de nossas ferramentas. Estamos trabalhando para trazer novos recursos e melhorar a experiêcia dos usuários. A geração de documentação e evidencias de código também serão muito mais efetivas, pois certas coisas não mais serão necessárias para a verificação de código, pois tudo já estará pronto para uso.\n' +
            '\n' +
            'Aproveite os frutos da nossa atualização e fique ligado para mais atualizações no futuro.\n' +
            '\n' +
            'Atenciosamente, \n' +
            'Equipe de Desenvolvimento da Field Control'
        })
        return true
      })
      .reply(201)

    await probot.receive({ name: 'pull_request.opened', payload })
  })

  test('on pull_request edited', async () => {
    nock('https://api.github.com')
      .post('/graphql', (body) => {
        expect(body).toMatchObject({
          query: '\n' +
          '      query ($owner: String!, $name: String!, $prNumber: Int!) {\n' +
          '        repository (owner: $owner, name: $name) {\n' +
          '          pullRequest (number: $prNumber) {\n' +
          '            closingIssuesReferences (first: 5) {\n' +
          '              nodes {\n' +
          '                number\n' +
          '              }\n' +
          '            }\n' +
          '          }\n' +
          '        }\n' +
          '      }',
          variables: {
            owner: 'ottonielmatheus',
            name: 'fieldney-bot',
            prNumber: 9
          }
        })
        return true
      })
      .reply(200, prClosedIssuesResponse)

    nock('https://api.github.com')
      .post('/graphql', (body) => {
        expect(body).toMatchObject({
          query: '\n' +
          '      query ($owner: String!, $name: String!, $issueNumber: Int!) {\n' +
          '        repository (owner: $owner, name: $name) {\n' +
          '          issue (number: $issueNumber) {\n' +
          '            title\n' +
          '            body\n' +
          '          }\n' +
          '        }\n' +
          '      }\n' +
          '    ',
          variables: {
            owner: 'ottonielmatheus',
            name: 'fieldney-bot',
            issueNumber: 5
          }
        })
        return true
      })
      .reply(200, issueResponse)

    nock('https://api.openai.com:443')
      .post('/v1/completions', (body) => {
        expect(body).toMatchObject({
          prompt: 'Comunique um e-mail descolado de uma alteração no código,\n' +
            'com descrição que deve ser explicativa para o público em geral.\n' +
            '\n' +
            'Será enviado para funcionários internos da empresa Field Control.\n' +
            'Onde usamos "Fielders" para nos referirmos aos funcionários da empresa.\n' +
            '\n' +
            'Deve possuir os seguintes tópicos separados:\n' +
            '\n' +
            'Tópico "**Contexto**", onde o contexto é:\n' +
            'Como "Issue description" afeta "Repository description".\n' +
            '\n' +
            'Tópico "**Motivações**", onde as motivações para essas implementações foram:\n' +
            '(Melhore esse texto: "Issue description")\n' +
            '\n' +
            'Tópico "**Implementação**", onde as implementações são:\n' +
            '(melhore esse texto: "Pull request description")\n' +
            '\n' +
            'E adicione um último tópico "Evoluções" apresentando as evoluções que essas implementações implicam.<END>',
          model: 'text-davinci-003',
          temperature: 1,
          max_tokens: 524,
          stop: '<END>'
        })
        return true
      })
      .reply(200, fieldnewsSuggestionResponse)

    nock('https://api.github.com')
      .post('/graphql', (body) => {
        expect(body).toMatchObject({
          query: '\n' +
          '      query ($owner: String!, $name: String!, $prNumber: Int!) {\n' +
          '        repository (owner: $owner, name: $name) {\n' +
          '          pullRequest (number: $prNumber) {\n' +
          '            comments (first: 10) {\n' +
          '              nodes {\n' +
          '                databaseId\n' +
          '                body\n' +
          '                author {\n' +
          '                  login\n' +
          '                }\n' +
          '              }\n' +
          '            }\n' +
          '          }\n' +
          '        }\n' +
          '      }',
          variables: {
            owner: 'ottonielmatheus',
            name: 'fieldney-bot',
            prNumber: 9
          }
        })
        return true
      })
      .reply(200, pullRequestCommentsResponse)

    nock('https://api.github.com')
      .post('/repos/ottonielmatheus/fieldney-bot/issues/9/comments', (body) => {
        expect(body).toMatchObject({
          body: 'Sugestão de Fieldnews \n' +
            '------------ \n' +
            'Salve **@ottonielmatheus**! Aqui vai uma sugestão de Fieldnews quentinha que eu gerei pra você. 💙\n' +
            'Não se esqueça de revisar! 🚀 \n' +
            '\n' +
            'Assunto: Atualizações da Base de Código da Field Control\n' +
            '\n' +
            'Prezados Fielders,\n' +
            '\n' +
            'Estamos empolgados para compartilhar as mais recentes atualizações na Base de Código da Field Control. Estamos expandindo nosso sistema para melhorar a produtividade de nossos usuários e nos aproximar aos nossos objetivos de negócios.\n' +
            '\n' +
            'Contexto:\n' +
            '\n' +
            'Estamos fazendo uma atualização no repositório de código da Field Control. Esta atualização é para permitir que o código seja reutilizado por outros usuários. Estes recursos permitirão que os Fielders criem uma documentação clara e eficiente, bem como fornecer um código mais otimizado para uso futuro.\n' +
            '\n' +
            'Motivações:\n' +
            '\n' +
            'Estamos atualizando o repositório de código da Field Control para melhorar a facilidade de uso e introspecção dos nossos recursos. Estas mudanças nos permitirão desenvolver novos recursos de maneira mais ágil e ter os melhores padrões de código possíveis.\n' +
            '\n' +
            'Implementação:\n' +
            '\n' +
            'Estamos fazendo commit em uma nova versão do repositório da Field Control. Devemos garantir que o código atual seja refatorado e melhorado com novas ferramentas. Desse modo, deverá ser mais intuitivo para os desenvolvedores trabalharem com ele e permitirá que novas iteratividades sejam realizadas de forma mais rápida.\n' +
            '\n' +
            'Evolução:\n' +
            '\n' +
            'Esta implementação melhorará significativamente a facilidade de uso e a qualidade de nossas ferramentas. Estamos trabalhando para trazer novos recursos e melhorar a experiêcia dos usuários. A geração de documentação e evidencias de código também serão muito mais efetivas, pois certas coisas não mais serão necessárias para a verificação de código, pois tudo já estará pronto para uso.\n' +
            '\n' +
            'Aproveite os frutos da nossa atualização e fique ligado para mais atualizações no futuro.\n' +
            '\n' +
            'Atenciosamente, \n' +
            'Equipe de Desenvolvimento da Field Control'
        })
        return true
      })
      .reply(201)

    await probot.receive({ name: 'pull_request.edited', payload })
  })

  test('on pull_request labeled', async () => {
    nock('https://slack.com:443/api')
      .post('/chat.postMessage', (body) => {
        expect(body).toMatchObject({
          channel: 'developers',
          text: '<!channel>, *ottonielmatheus* acabou de subir uma *hotfix* para o *fieldney-bot*, precisamos de review urgente! 🔥🚒\n' +
            'https://github.com/this-is-just-a-test-org/test-repo/pull/9'
        })
        return true
      })
      .reply(200, { ok: true })

    await probot.receive({ name: 'pull_request.labeled', payload: labeledPayload })
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })
})
