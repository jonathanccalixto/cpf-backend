const { CpfBlacklist } = require('../models')

class CpfBlacklistController {
  async status (req, res) {
    const { cpf } = req.query
    return res.json(await CpfBlacklist.status({ cpf }))
  }
}

module.exports = new CpfBlacklistController()
