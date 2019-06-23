require('../jest_helper').getServer()

const CPF = require('@fnando/cpf/dist/node')

const { CpfBlacklist } = require('../../src/app/models')
const { RecordInvalidError } = require('../../src/app/exceptions')

describe('CpfBlacklist', () => {
  describe('add', () => {
    it('throws exception when cpf is invalid', async () => {
      const addFunction = async () => {
        await CpfBlacklist.add({ cpf: 'invalid cpf' })
      }
      await expect(addFunction()).rejects.toThrow(RecordInvalidError)
    })

    it('throws exception when cpf already blacklisted', async () => {
      const addFunction = async () => {
        const cpf = CPF.generate(true)
        await CpfBlacklist.add({ cpf })
        await CpfBlacklist.add({ cpf })
      }
      await expect(addFunction()).rejects.toThrow(RecordInvalidError)
    })

    it('returns blacklist item when cpf is register', async () => {
      const cpf = CPF.generate(true)
      const result = await CpfBlacklist.add({ cpf })
      expect(result).toMatchObject({ cpf, removedAt: null })
    })

    it('returns blacklist item when cpf already was blacklisted', async () => {
      const cpf = CPF.generate(true)
      await CpfBlacklist.add({ cpf })
      await CpfBlacklist.remove({ cpf })
      const result = await CpfBlacklist.add({ cpf })
      expect(result).toMatchObject({ cpf, removedAt: null })
    })
  })

  describe('remove', () => {
    it('throws exception when cpf is invalid', async () => {
      const removeFunction = async () => {
        await CpfBlacklist.remove({ cpf: 'invalid cpf' })
      }
      await expect(removeFunction()).rejects.toThrow(RecordInvalidError)
    })

    it('throws exception when cpf has already been removed from the blacklist', async () => {
      const removeFunction = async () => {
        const cpf = CPF.generate(true)
        await CpfBlacklist.add({ cpf })
        await CpfBlacklist.remove({ cpf })
        await CpfBlacklist.remove({ cpf })
      }
      await expect(removeFunction()).rejects.toThrow(RecordInvalidError)
    })

    it('throws exception when cpf was never blacklisted', async () => {
      const removeFunction = async () => {
        const cpf = CPF.generate(true)
        await CpfBlacklist.remove({ cpf })
      }
      await expect(removeFunction()).rejects.toThrow(RecordInvalidError)
    })

    it('returns blacklist item when cpf is register', async () => {
      const cpf = CPF.generate(true)
      await CpfBlacklist.add({ cpf })
      const result = await CpfBlacklist.remove({ cpf })
      expect(result.cpf).toBe(cpf)
      expect(result.removedAt).not.toBeNull()
    })
  })

  describe('status', () => {
    it('throws exception when cpf is invalid', async () => {
      const statusFunction = async () => {
        await CpfBlacklist.status({ cpf: 'invalid cpf' })
      }
      await expect(statusFunction()).rejects.toThrow(RecordInvalidError)
    })

    it('returns FREE when cpf was never blacklisted', async () => {
      const cpf = CPF.generate(true)
      const status = await CpfBlacklist.status({ cpf })
      expect(status).toBe('FREE')
    })

    it('returns FREE when cpf has been removed from the blacklist', async () => {
      const cpf = CPF.generate(true)
      await CpfBlacklist.add({ cpf })
      await CpfBlacklist.remove({ cpf })
      const status = await CpfBlacklist.status({ cpf })
      expect(status).toBe('FREE')
    })

    it('returns FREE when cpf was never blacklisted', async () => {
      const cpf = CPF.generate(true)
      await CpfBlacklist.add({ cpf })
      const status = await CpfBlacklist.status({ cpf })
      expect(status).toBe('BLOCK')
    })
  })
})
