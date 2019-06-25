const { request, getServer } = require('../jest_helper')

const mongoose = require('mongoose')

const { Uptime } = require('../../src/app/models')
const { UptimeSchema, CpfBlacklistSchema } = require('../../src/db/schemas')

const UptimeTable = mongoose.model('Uptime', UptimeSchema)
const CpfBlacklistTable = mongoose.model('CpfBlacklist', CpfBlacklistSchema)

let server

describe('UptimeController', () => {
  beforeEach(async () => {
    server = getServer()
  })
  afterEach(async () => {
    await UptimeTable.deleteMany({})
    server.close()
  })

  describe('status: GET /status', () => {
    it('responds with a uptime data when uptime exists', async () => {
      await UptimeTable.deleteMany({})
      await CpfBlacklistTable.deleteMany({})

      await Uptime.create()

      const { status, body } = await request(server).get('/status')

      expect(status).toBe(200)
      expect(body).toMatchObject({ queries: 0, blacklists: 0 })
      expect(body.startedAt).not.toBeNull()
    })

    it('responds with uptime not found when no uptime created', async () => {
      await UptimeTable.deleteMany({})
      await CpfBlacklistTable.deleteMany({})

      const { status, body } = await request(server).get('/status')

      expect(status).toBe(400)
      expect(body).toBe('Uptime não iniciado!')
    })
  })
})
