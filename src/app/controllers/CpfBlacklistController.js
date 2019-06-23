const { CpfBlacklist } = require('../models')

class CpfBlacklistController {
  async status (req, res) {
    const { cpf } = req.query
    return res.json(await CpfBlacklist.status({ cpf }))
  }

  async add (req, res) {
    const { cpf } = req.body
    return res.status(203).json(await CpfBlacklist.add({ cpf }))
  }
}

module.exports = new CpfBlacklistController()
