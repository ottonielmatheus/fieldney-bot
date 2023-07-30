module.exports = (context, implementation, motivation) => {
  const implementationRegex = /<implementation>([\s\S]{0,})<\/implementation>/gm
  const implementationMatchs = implementationRegex.exec(implementation)
  implementation = implementationMatchs ? implementationMatchs[1] : null
  implementation = implementation ? implementation.replaceAll('\n', '') : null
  motivation = motivation ? motivation.split('\n\n')[0] : null

  return {
    context,
    motivation,
    implementation
  }
}
