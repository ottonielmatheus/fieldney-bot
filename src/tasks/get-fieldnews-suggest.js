const OpenAI = require('../core/integrations/openai')
const openaiApi = new OpenAI()

function getTopics (context, implementation, motivation) {
  const implementationRegex = /<implementation>([\s\S]{0,})<\/implementation>/gm
  motivation = motivation.split('\n\n')[0].trim()
  implementation = implementationRegex.exec(implementation)[1]
  implementation = implementation ? implementation.replaceAll('\n', '').trim() : ''
  return {
    context,
    motivation,
    implementation
  }
}

module.exports = async (repoDescription, prDescription, issueDescription) => {
  const { context, motivation, implementation } = getTopics(repoDescription, prDescription, issueDescription)
  const prompt = `
      Comunique um e-mail descolado de uma alteração no código,
      com descrição que deve ser explicativa para o público em geral.

      Será enviado para funcionários internos da empresa Field Control.
      Onde usamos "Fielders" para nos referirmos aos funcionários da empresa.

      Deve possuir os seguintes tópicos separados:

      Tópico "**Contexto**", onde o contexto é:
      Como "${motivation}" afeta "${context}".

      Tópico "**Motivações**", onde as motivações para essas implementações foram:
      (Melhore esse texto: "${motivation}")

      Tópico "**Implementação**", onde as implementações são:
      (melhore esse texto: "${implementation}")

      E adicione um último tópico "Evoluções" apresentando as evoluções que essas implementações implicam.

      Importante: O texto gerado não deve conter tabulações.
    `

  return openaiApi.execPrompt(prompt)
}
