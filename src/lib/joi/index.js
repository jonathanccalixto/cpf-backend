const extensions = require('require-directory')(module)
let Joi = require('@hapi/joi')

Object.entries(extensions).forEach(([name, extension]) => {
  Joi = Joi.extend(extension(Joi))
})

module.exports = Joi
