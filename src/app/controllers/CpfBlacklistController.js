const { CpfBlacklist } = require('../models')

class CpfBlacklistController {
  async status (req, res) {
    const { cpf } = req.query
    return res.json(await CpfBlacklist.status({ cpf }))
  }

  async add (req, res) {
    const { cpf } = req.body
    return res.status(201).json(await CpfBlacklist.add({ cpf }))
  }

  async remove (req, res) {
    const { cpf } = req.body
    return res.json(await CpfBlacklist.remove({ cpf }))
  }
}

module.exports = new CpfBlacklistController()
