const nock = require('nock')
const receiver = require('./../../src/slack/app')

describe('Test slack events', () => {
  beforeEach(async () => {
    nock.disableNetConnect()
  })

  test('on "oi @fieldney" message', async () => {
  })

  afterEach(async () => {
    nock.cleanAll()
    nock.enableNetConnect()
    await receiver.stop()
  })
})
