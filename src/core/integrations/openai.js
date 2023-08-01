const { Configuration, OpenAIApi } = require('openai')
const config = require('./../config')

class OpenAI {
  constructor (model = 'text-davinci-002', temperature = 1, maxTokens = 524) {
    const configuration = new Configuration({
      organization: config.openai.organization,
      apiKey: config.openai.apiKey
    })

    this.openai = new OpenAIApi(configuration)
    this.model = model
    this.temperature = temperature
    this.maxTokens = maxTokens
  }

  async execPrompt (prompt) {
    try {
      const { data } = await this.openai.createCompletion({
        prompt: prompt + '<END>',
        model: this.model,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        stop: '<END>'
      })
      return data.choices[0].text.trim()
    } catch (err) {
      return null
    }
  }
}

module.exports = OpenAI
