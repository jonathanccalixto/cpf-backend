const cpf = require('@fnando/cpf/dist/node')

module.exports = Joi => ({
  name: 'document',
  base: Joi.string(),
  language: {
    cpf: 'is invalid'
  },
  rules: [
    {
      name: 'cpf',
      validate (params, value, state, options) {
        if (!cpf.isValid(value)) {
          return this.createError('document.cpf', { v: value }, state, options)
        }

        return value
      }
    }
  ]
})
