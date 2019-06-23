const CPF = require('@fnando/cpf/dist/node')

const request = require('../jest_helper')
const { CpfBlacklist } = require('../../src/app/models')

describe('/cpf', () => {
  describe('GET /status', () => {
    it('responds FREE when it sends a valid cpf that is not blacklisted', async () => {
      const cpf = CPF.generate(true)
      const { status, body } = await request()
        .get('/cpf/status')
        .query({ cpf })

      expect(status).toBe(200)
      expect(body).toBe('FREE')
    })

    it('responds FREE when it sends a valid cpf that has already been removed from the blacklist', async () => {
      const cpf = CPF.generate(true)

      await CpfBlacklist.add({ cpf })
      await CpfBlacklist.remove({ cpf })

      const { status, body } = await request()
        .get('/cpf/status')
        .query({ cpf })

      expect(status).toBe(200)
      expect(body).toBe('FREE')
    })

    it('responds BLOCK when it sends a valid cpf that is blacklisted', async () => {
      const cpf = CPF.generate(true)

      await CpfBlacklist.add({ cpf })

      const { status, body } = await request()
        .get('/cpf/status')
        .query({ cpf })

      expect(status).toBe(200)
      expect(body).toBe('BLOCK')
    })

    it('responds with invalid cpf when sending an invalid cpf', async () => {
      const cpf = '638.174.677-71'

      const { status, body } = await request()
        .get('/cpf/status')
        .query({ cpf })

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" is invalid']
      })
    })

    it('responds with cpf not allowed when not sending cpf', async () => {
      const { status, body } = await request().get('/cpf/status')

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" is not allowed to be empty']
      })
    })
  })
})
