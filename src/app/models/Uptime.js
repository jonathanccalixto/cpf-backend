const mongoose = require('mongoose')

const { UptimeSchema, CpfBlacklistSchema } = require('../../db/schemas')
const { RecordInvalidError } = require('../exceptions')

const CpfBlacklistTable = mongoose.model('CpfBlacklist', CpfBlacklistSchema)
const UptimeTable = mongoose.model('Uptime', UptimeSchema)

const throwsRecordInvalidError = (message) => {
  throw new RecordInvalidError(message)
}

const getInstance = async () => {
  let instance = await UptimeTable.findOne().sort('-createdAt')

  if (!instance) {
    throwsRecordInvalidError('Uptime não iniciado!')
  }

  return instance
}

module.exports = {
  create: async () => {
    const blacklists = await CpfBlacklistTable.countDocuments({
      removedAt: null
    })
    await UptimeTable.create({ blacklists })
  },
  addQuery: async () => {
    const instance = await getInstance()
    instance.queries += 1
    await instance.save()
  },
  addBlacklist: async () => {
    const instance = await getInstance()
    instance.blacklists += 1
    await instance.save()
  },
  removeBlacklist: async () => {
    const instance = await getInstance()

    if (instance.blacklists === 0) {
      throwsRecordInvalidError('Nenhum registro na blacklist!')
    }

    instance.blacklists -= 1
    await instance.save()
  },
  status: async () => {
    const instance = await getInstance()

    return {
      startedAt: instance.createdAt,
      queries: instance.queries,
      blacklists: instance.blacklists
    }
  }
}
