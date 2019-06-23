const express = require('express')
const routes = express.Router()
const handle = require('express-async-handler')

const controllers = require('../app/controllers')

// UptimeController
const { UptimeController } = controllers
routes.get('/status', handle(UptimeController.status))

// CpfBlacklistController
const { CpfBlacklistController } = controllers
routes.get('/cpf/status', handle(CpfBlacklistController.status))
routes.post('/cpf/add', handle(CpfBlacklistController.add))
routes.delete('/cpf/remove', handle(CpfBlacklistController.remove))

module.exports = routes
