module.exports = class RecordInvalidError extends Error {
  constructor (message, validations) {
    super(message || 'Record is invalid!')
    this.validations = validations
    Error.captureStackTrace(this, RecordInvalidError)
  }
  toJSON () {
    return { message: this.message, validations: this.validations }
  }
}
