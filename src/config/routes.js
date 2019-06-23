const express = require('express')
const routes = express.Router()
const handle = require('express-async-handler')

const controllers = require('../app/controllers')

// CpfBlacklistController
const { CpfBlacklistController } = controllers
routes.get('/cpf/status', handle(CpfBlacklistController.status))
routes.post('/cpf/add', handle(CpfBlacklistController.add))

module.exports = routes
