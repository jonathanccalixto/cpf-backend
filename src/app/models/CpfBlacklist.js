const mongoose = require('mongoose')
const CPF = require('@fnando/cpf/dist/node')

const Joi = require('../../lib/joi')
const { CpfBlacklistSchema } = require('../../db/schemas')
const { RecordInvalidError } = require('../exceptions')

const model = mongoose.model('CpfBlacklist', CpfBlacklistSchema)

const throwsRecordInvalidError = ({ message, fields }) => {
  throw new RecordInvalidError(message, fields)
}

const valid = attributes => {
  const { error } = Joi.validate(attributes, { cpf: Joi.document().cpf() })

  if (error) {
    throwsRecordInvalidError({
      fields: error.details.map(({ message }) => message)
    })
  }
}

module.exports = {
  add: async ({ cpf }) => {
    cpf = CPF.strip(cpf)
    valid({ cpf })

    const instance = await model.findOne({ document: cpf, removedAt: null })

    if (instance) {
      throwsRecordInvalidError({ fields: ['"cpf" was added in blacklist'] })
    }

    const { document, removedAt, createdAt, updatedAt } = await model.create({
      document: cpf
    })

    return { cpf: CPF.format(document), removedAt, createdAt, updatedAt }
  },

  remove: async ({ cpf }) => {
    cpf = CPF.strip(cpf)
    valid({ cpf })

    const instance = await model.findOne({ document: cpf }).sort('-createdAt')

    if (!instance || instance.removedAt) {
      throwsRecordInvalidError({ fields: ['"cpf" was not added in blacklist'] })
    }

    instance.removedAt = new Date()
    await instance.save()

    const { document, removedAt, createdAt, updatedAt } = instance

    return { cpf: CPF.format(document), removedAt, createdAt, updatedAt }
  },

  status: async ({ cpf }) => {
    cpf = CPF.strip(cpf)
    valid({ cpf })

    const instance = await model.findOne({ document: cpf }).sort('-createdAt')

    return !instance || instance.removedAt ? 'FREE' : 'BLOCK'
  }
}
