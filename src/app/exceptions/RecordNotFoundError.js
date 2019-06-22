const RecordNotFoundError = function (message) {
  this.name = 'RecordNotFoundError'
  this.message = message || 'Record not found!'
  this.stack = new Error().stack
}
RecordNotFoundError.prototype = Object.create(RecordNotFoundError.prototype)
RecordNotFoundError.prototype.constructor = RecordNotFoundError
RecordNotFoundError.prototype.toJson = function () {
  return { message: this.message }
}

module.exports = RecordNotFoundError
