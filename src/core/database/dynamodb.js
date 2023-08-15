const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { GetCommand, PutCommand, UpdateItemCommand, DeleteItemCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb')
const { mapKeys } = require('lodash')
const { v4: uuid } = require('uuid')
const config = require('../config')

class DynamoDB {
  constructor () {
    this.client = new DynamoDBClient({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
      },
      endpoint: config.aws.endpoint
    })
    this.doc = DynamoDBDocumentClient.from(this.client)
  }

  async _getUpdateAttrs (item) {
    return mapKeys(item, (value, key) => ':' + key)
  }

  async _getUpdateExpression (item) {
    return Object.keys(item).map(key => `${key} = :${key}`).join(', ')
  }

  _read (params) {
    return async (key) => {
      params.Key = key
      const command = new GetCommand(params)
      return await this.doc.send(command)
    }
  }

  _write (params) {
    return async (item) => {
      item.id = uuid()
      params.Item = item
      const command = new PutCommand(params)
      return await this.doc.send(command)
    }
  }

  _delete (params) {
    return (key) => {
      params.Key = key
      const command = new DeleteItemCommand(params)
      return this.doc.send(command)
    }
  }

  _update (params) {
    return async (item, key) => {
      params.Key = key
      params.UpdateExpression = 'set ' + this._getUpdateExpression(item)
      params.ExpressionAttributeValues = this._getUpdateAttrs(item)
      params.ReturnValues = 'UPDATED_NEW'
      const command = new UpdateItemCommand(params)
      return await this.doc.send(command)
    }
  }

  table (tableName) {
    const params = {
      TableName: tableName
    }
    return {
      read: this._read(params),
      write: this._write(params),
      update: this._update(params),
      delete: this._delete(params)
    }
  }
}

module.exports = new DynamoDB()
