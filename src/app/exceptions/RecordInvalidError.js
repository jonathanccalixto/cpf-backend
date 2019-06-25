module.exports = class RecordInvalidError extends Error {
  constructor (message) {
    super(message || 'Um ou mais erros de validação foram encontrados!')
    Error.captureStackTrace(this, RecordInvalidError)
  }
  toJSON () {
    return this.message
  }
}
