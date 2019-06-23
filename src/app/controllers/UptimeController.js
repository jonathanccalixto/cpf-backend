const { Uptime } = require('../models')

class UptimeController {
  async status (req, res) {
    const uptime = await Uptime.status()

    return res.json(uptime)
  }
}

module.exports = new UptimeController()
