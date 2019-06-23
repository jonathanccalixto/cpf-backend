module.exports = class RecordNotFoundError extends Error {
  constructor (message, validations) {
    super(message || 'Record not found!')
    Error.captureStackTrace(this, RecordNotFoundError)
  }
  toJSON () {
    return { message: this.message }
  }
}
