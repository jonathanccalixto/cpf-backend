const CPF = require('@fnando/cpf/dist/node')

const request = require('../jest_helper')
const { CpfBlacklist } = require('../../src/app/models')

describe('CpfBlacklistController', () => {
  describe('status: GET /cpf/status', () => {
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

  describe('add: POST /cpf/add', () => {
    it('responds with the cpf`s data when cpf is valid and no blacklisted', async () => {
      const cpf = CPF.generate(true)
      const { status, body } = await request()
        .post('/cpf/add')
        .send({ cpf })

      expect(status).toBe(201)
      expect(body).toMatchObject({ cpf, removedAt: null })
    })

    it('responds with the cpf`s data when cpf is valid and was blacklisted', async () => {
      const cpf = CPF.generate(true)

      await CpfBlacklist.add({ cpf })
      await CpfBlacklist.remove({ cpf })

      const { status, body } = await request()
        .post('/cpf/add')
        .send({ cpf })

      expect(status).toBe(201)
      expect(body).toMatchObject({ cpf, removedAt: null })
    })

    it('responds with cpf already added when cpf is valid and blacklisted', async () => {
      const cpf = CPF.generate(true)

      await CpfBlacklist.add({ cpf })

      const { status, body } = await request()
        .post('/cpf/add')
        .send({ cpf })

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" was added in blacklist']
      })
    })

    it('responds with invalid cpf when cpf is valid and blacklisted', async () => {
      const cpf = '638.174.677-71'

      const { status, body } = await request()
        .post('/cpf/add')
        .send({ cpf })

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" is invalid']
      })
    })

    it('responds with cpf not allowed when cpf is valid and blacklisted', async () => {
      const { status, body } = await request().post('/cpf/add')

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" is not allowed to be empty']
      })
    })
  })

  describe('remove: DELETE /cpf/remove', () => {
    it('responds with the cpf`s data when cpf is valid and blacklisted', async () => {
      const cpf = CPF.generate(true)

      await CpfBlacklist.add({ cpf })

      const { status, body } = await request()
        .delete('/cpf/remove')
        .send({ cpf })

      expect(status).toBe(200)
      expect(body.cpf).toBe(cpf)
      expect(body.removedAt).not.toBeNull()
    })

    it('responds with the cpf no blacklisted when cpf is valid and no blacklisted', async () => {
      const cpf = CPF.generate(true)

      const { status, body } = await request()
        .delete('/cpf/remove')
        .send({ cpf })

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" was not added in blacklist']
      })
    })

    it('responds with cpf already added when cpf is valid and was blacklisted', async () => {
      const cpf = CPF.generate(true)

      await CpfBlacklist.add({ cpf })
      await CpfBlacklist.remove({ cpf })

      const { status, body } = await request()
        .delete('/cpf/remove')
        .send({ cpf })

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" was not added in blacklist']
      })
    })

    it('responds with invalid cpf when cpf is valid and blacklisted', async () => {
      const cpf = '638.174.677-71'

      const { status, body } = await request()
        .delete('/cpf/remove')
        .send({ cpf })

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" is invalid']
      })
    })

    it('responds with cpf not allowed when cpf is valid and blacklisted', async () => {
      const { status, body } = await request().delete('/cpf/remove')

      expect(status).toBe(400)
      expect(body).toMatchObject({
        message: 'One or more validation errors occurred:',
        fields: ['"cpf" is not allowed to be empty']
      })
    })
  })
})
