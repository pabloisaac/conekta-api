const dotenv = require('dotenv')

dotenv.config()

const port = process.env.PORT || 8080
const host = process.env.HOST || 'localhost'
const domain = `http://${host}:${port}`

const config = {
  APP: {
    DB_URL: `mongodb://localhost:27017/${process.env.DB_NAME}`,
    DB: process.env.DB_NAME,
    PORT: process.env.PORT
  }
}

exports.init = (app) => {
  const mode = app.get('env')
  console.log(`[*] MODE: ${mode}`)
  console.log(`[*] DOMAIN: ${domain}`)
  return config
}