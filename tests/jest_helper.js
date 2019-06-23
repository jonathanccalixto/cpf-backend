const app = require('../src/App')

const getPort = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = () => {
  server: app.listen(getPort(60000, 65536))
}
