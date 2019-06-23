module.exports = class RecordInvalidError extends Error {
  constructor (message, fields) {
    super(message || 'One or more validation errors occurred:')
    this.fields = fields
    Error.captureStackTrace(this, RecordInvalidError)
  }
  toJSON () {
    return { message: this.message, fields: this.fields }
  }
}
