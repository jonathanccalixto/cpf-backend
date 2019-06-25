require('../jest_helper').getServer()

const mongoose = require('mongoose')

const { UptimeSchema, CpfBlacklistSchema } = require('../../src/db/schemas')
const { Uptime } = require('../../src/app/models')
const { RecordInvalidError } = require('../../src/app/exceptions')

const CpfBlacklistTable = mongoose.model('CpfBlacklist', CpfBlacklistSchema)
const UptimeTable = mongoose.model('Uptime', UptimeSchema)

describe('CpfBlacklist', () => {
  beforeEach(async () => {
    await CpfBlacklistTable.deleteMany({})
    await UptimeTable.deleteMany({})
  })
  afterEach(async () => {
    await CpfBlacklistTable.deleteMany({})
    await UptimeTable.deleteMany({})
  })

  describe('create', () => {
    it('creates a new Uptime', async () => {
      const before = await UptimeTable.countDocuments()
      await Uptime.create()
      const after = await UptimeTable.countDocuments()

      expect(after).toBe(before + 1)
    })
  })

  describe('addQuery', () => {
    it('throws exception when no uptime create', async () => {
      const addQueryFunction = async () => {
        await Uptime.addQuery()
      }
      await expect(addQueryFunction()).rejects.toThrow(RecordInvalidError)
    })

    it('add query count when uptime exists', async () => {
      await Uptime.create()
      const before = await UptimeTable.findOne().sort('-createdAt')
      await Uptime.addQuery()
      const after = await UptimeTable.findOne().sort('-createdAt')

      expect(after.queries).toBe(before.queries + 1)
    })
  })

  describe('addBlacklist', () => {
    it('throws exception when no uptime create', async () => {
      const addBlacklistFunction = async () => {
        await Uptime.addBlacklist()
      }
      await expect(addBlacklistFunction()).rejects.toThrow(RecordInvalidError)
    })

    it('add blacklist count when uptime exists', async () => {
      await Uptime.create()
      const before = await UptimeTable.findOne().sort('-createdAt')
      await Uptime.addBlacklist()
      const after = await UptimeTable.findOne().sort('-createdAt')

      expect(after.blacklists).toBe(before.blacklists + 1)
    })
  })

  describe('removeBlacklist', () => {
    it('throws exception when no uptime create', async () => {
      const removeBlacklistFunction = async () => {
        await Uptime.removeBlacklist()
      }
      await expect(removeBlacklistFunction()).rejects.toThrow(
        RecordInvalidError
      )
    })

    it('throws exception when uptime exists but blacklist is zero', async () => {
      const removeBlacklistFunction = async () => {
        await Uptime.create()
        await Uptime.removeBlacklist()
      }
      await expect(removeBlacklistFunction()).rejects.toThrow(
        RecordInvalidError
      )
    })

    it('removes blacklist count when uptime exists and blacklist greater than 0', async () => {
      await Uptime.create()
      await Uptime.addBlacklist()
      const before = await UptimeTable.findOne().sort('-createdAt')
      await Uptime.removeBlacklist()
      const after = await UptimeTable.findOne().sort('-createdAt')

      expect(after.blacklists).toBe(before.blacklists - 1)
    })
  })
})
