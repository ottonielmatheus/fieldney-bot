const mongodb = require('../../../src/core/database/mongodb')

describe('Test mongodb connection', () => {
  it('should get "ok" when ping to mongodb server', async () => {
    const res = await mongodb.tx(db => db.command({ ping: 1 }))
    expect(res.ok).toBe(1)
  })
})
