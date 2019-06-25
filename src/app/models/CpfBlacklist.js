const mongoose = require('mongoose')
const CPF = require('@fnando/cpf/dist/node')

const { CpfBlacklistSchema } = require('../../db/schemas')
const { RecordInvalidError } = require('../exceptions')

const model = mongoose.model('CpfBlacklist', CpfBlacklistSchema)

const throwsRecordInvalidError = (message) => {
  throw new RecordInvalidError(message)
}

const valid = ({ cpf }) => {
  if (!cpf) {
    throwsRecordInvalidError('CPF deve ser informado!')
  } else if (!CPF.isValid(cpf)) {
    throwsRecordInvalidError('CPF inválido')
  }
}

module.exports = {
  add: async ({ cpf }) => {
    const document = CPF.strip(cpf)
    valid({ cpf: document })

    const instance = await model.findOne({ document, removedAt: null })

    if (instance) {
      throwsRecordInvalidError('CPF já adicionado a blacklist!')
    }

    const { removedAt, createdAt, updatedAt } = await model.create({ document })

    return { cpf: CPF.format(document), removedAt, createdAt, updatedAt }
  },

  remove: async ({ cpf }) => {
    cpf = CPF.strip(cpf)
    valid({ cpf })

    const instance = await model.findOne({ document: cpf }).sort('-createdAt')

    if (!instance || instance.removedAt) {
      throwsRecordInvalidError('CPF não está na blacklist')
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
