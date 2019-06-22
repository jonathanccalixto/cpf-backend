const env = process.env.NODE_ENV || 'development'
const host = process.env.DB_HOST || 'localhost'
const port = process.env.DB_PORT || 27017
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const database = `${process.env.DB_NAME || 'cpf-backend'}-${env}`

const credentials = username && password ? `${username}:${password}@` : ''

module.exports = {
  connection: `mongodb://${credentials}${host}:${port}/${database}`,
  options: { useCreateIndex: true, useNewUrlParser: true },
  message: {
    success: () => {
      console.log(`Connected on mongodb://${host}:${port}/${database}`)
    },
    failure: () => {
      console.error('Failed to connect with the mongodb!')
    }
  }
}
