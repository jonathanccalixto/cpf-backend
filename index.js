const app = require('./src/App')

const port = process.env.PORT || 4000
const host = process.env.HOST || 'localhost'

app.listen(port, host, () => console.log(`Listening on ${host}:${port}...`))
