const crypto = require('crypto')
const config = require('../../core/config')

class TrelloHandler {
  constructor () {
    this.secret = config.trello.secret
  }

  validateSecret (request, secret) {
    const callbackURL = 'https://' + request.headers.Host + request.path
    const content = request.body + callbackURL

    const doubleHash = crypto.createHmac('sha1', secret).update(content).digest('base64')
    const headerHash = request.headers['X-Trello-Webhook']

    return doubleHash === headerHash
  }

  getActionType (action) {
    const category = action.type
    const subcategory = {
      action_move_card_from_list_to_list: 'moved',
      action_changed_description_of_card: 'desc_changed'
    }[action.display.translationKey] || null

    return `${category}${'.' + subcategory || ''}`
  }

  handleApp (app) {
    return async (event) => {
      try {
        if (event.httpMethod === 'HEAD') {
          return { statusCode: 200 }
        }

        const matchsSecret = this.validateSecret(event, this.secret)
        if (!matchsSecret) {
          return { statusCode: 401 }
        }

        const body = JSON.parse(event.body)
        await app.execute(this.getActionType(body.action), body.action)
        return { statusCode: 200 }
      } catch (err) {
        console.error(err)
        return { statusCode: 500 }
      }
    }
  }
}

module.exports = new TrelloHandler()
