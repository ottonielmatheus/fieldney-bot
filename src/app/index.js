const issues = require('./issues')

module.exports = (app) => {
  app.log('🤖 Beep-zeep ~ I\'m alive!')
  app.on(['issues.opened', 'issues.edited'], issues.onOpened)
}
