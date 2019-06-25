const { CpfBlacklist, Uptime } = require('../models')

const params = (req) => {
  const params = req.params || {}
  const query = req.query || {}
  const body = req.body || {}

  return { ...params, ...query, ...body }
}

class CpfBlacklistController {
  async status (req, res) {
    const { cpf } = params(req)
    const result = await CpfBlacklist.status({ cpf })

    await Uptime.addQuery()

    return res.json(result)
  }

  async add (req, res) {
    const { cpf } = params(req)
    const result = await CpfBlacklist.add({ cpf })

    await Uptime.addBlacklist()

    return res.status(201).json(result)
  }

  async remove (req, res) {
    const { cpf } = params(req)
    const result = await CpfBlacklist.remove({ cpf })

    await Uptime.removeBlacklist()

    return res.json(result)
  }
}

module.exports = new CpfBlacklistController()
