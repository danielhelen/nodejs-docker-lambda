const { v4: uuidv4 } = require('uuid')

exports.handler = async (event) => {
  const uuid = uuidv4()
  const input = event.input ?? 'No input was specified'

  return {
    uuid,
    input
  }
}
