const OpenAI = require('../../core/integrations/openai')
const openaiApi = new OpenAI()

module.exports = async (context, implementation, motivation, author) => {
  const prompt =
    'Comunique um e-mail descolado de uma alteração no código,\n' +
    'com descrição que deve ser explicativa para o público em geral.\n\n' +

    'Será enviado para funcionários internos da empresa Field Control.\n' +
    'Onde usamos "Fielders" para nos referirmos aos funcionários da empresa.\n\n' +

    'Deve possuir os seguintes tópicos separados:\n\n' +

    'Tópico "**Contexto**", onde o contexto é:\n' +
    `Como "${motivation}" afeta "${context}".\n\n` +

    'Tópico "**Motivações**", onde as motivações para essas implementações foram:\n' +
    `(Melhore esse texto: "${motivation}")\n\n` +

    'Tópico "**Implementação**", onde as implementações são:\n' +
    `(melhore esse texto: "${implementation}")\n\n` +

    'E adicione um último tópico "Evoluções" apresentando as evoluções que essas implementações implicam.'

  const suggestion = await openaiApi.execPrompt(prompt)
  if (!suggestion) {
    return 'Sugestão de Fieldnews \n' +
      '------------ \n' +
      `@${author.login}, não consegui montar um fieldnews para esse PR, meu cérebro parece não estar funcionando bem... 😵‍💫`
  }

  return 'Sugestão de Fieldnews \n' +
    '------------ \n' +
    `Salve **@${author.login}**! Aqui vai uma sugestão de Fieldnews quentinha que eu gerei pra você. 💙\n` +
    'Não se esqueça de revisar! 🚀 \n\n' + suggestion
}
