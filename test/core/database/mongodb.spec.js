const nock = require('nock')
const mongodb = require('../../../src/core/database/mongodb')

describe('Test mongodb connection', () => {
  beforeEach(() => {
    nock.disableNetConnect()
  })

  it('should get "ok" when ping to mongodb server', async () => {
    const res = await mongodb.tx(async db => await db.command({ ping: 1 }))
    expect(res.ok).toBe(1)
  })
})
