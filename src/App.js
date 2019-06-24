const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const morgan = require('morgan')
const Youch = require('youch')
const cors = require('cors')

const { RecordNotFoundError, RecordInvalidError } = require('./app/exceptions')
const { Uptime } = require('./app/models')

class App {
  constructor () {
    this.express = express()

    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }

  env () {
    return process.env.NODE_ENV || 'development'
  }

  database () {
    const { connection, options, message } = require('./config/database')
    mongoose
      .connect(connection, options)
      .then(message.success)
      .catch(message.failure)

    Uptime.create()
  }

  middlewares () {
    this.express.use(express.json())
    this.express.use(express.urlencoded({ extended: true }))
    this.express.use(cors())
    this.express.use(helmet())
    if (this.env() !== 'test') {
      this.express.use(morgan(this.env() === 'production' ? 'tiny' : 'dev'))
    }
  }

  routes () {
    this.express.use(require('./config/routes'))
  }

  exception () {
    this.express.use(async (err, req, res, next) => {
      if (err instanceof RecordNotFoundError) return res.status(404).json(err)
      if (err instanceof RecordInvalidError) return res.status(400).json(err)

      if (this.env() !== 'production') {
        const youch = new Youch(err, req)
        return res.send(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}

module.exports = new App().express
