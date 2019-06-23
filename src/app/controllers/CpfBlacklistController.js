const { CpfBlacklist, Uptime } = require('../models')

class CpfBlacklistController {
  async status (req, res) {
    const { cpf } = req.query
    const result = await CpfBlacklist.status({ cpf })

    await Uptime.addQuery()

    return res.json(result)
  }

  async add (req, res) {
    const { cpf } = req.body
    const result = await CpfBlacklist.add({ cpf })

    await Uptime.addBlacklist()

    return res.status(201).json(result)
  }

  async remove (req, res) {
    const { cpf } = req.body
    const result = await CpfBlacklist.remove({ cpf })

    await Uptime.removeBlacklist()

    return res.json(result)
  }
}

module.exports = new CpfBlacklistController()
