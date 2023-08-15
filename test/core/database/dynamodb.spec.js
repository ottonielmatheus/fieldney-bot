const db = require('../../../src/core/database/dynamodb')

describe('Test db connection', () => {
  it('should insert { github_login: "ottonielmatheus" } on db', async () => {
    const res = await db.table('users').write({ github_login: 'ottonielmatheus' })

    expect(res.$metadata.requestId).toBeTruthy()
    delete res.$metadata.requestId

    expect(res).toMatchObject({
      $metadata: {
        httpStatusCode: 200,
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
      },
      Attributes: undefined,
      ItemCollectionMetrics: undefined
    })
  })
})
