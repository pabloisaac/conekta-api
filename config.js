const dotenv = require('dotenv')

dotenv.config()

const port = w
const host = process.env.HOST || 'localhost'
const domain = `https://${host}:${port}`

const config = {
  APP: {
    DB_URL: "mongodb+srv://jupadevmongo:<password>@cluster0.14oa8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    DB: process.env.DB_NAME,
    PORT: port
  }
}

exports.init = (app) => {
  const mode = app.get('env')
  console.log(`[*] MODE: ${mode}`)
  console.log(`[*] DOMAIN: ${domain}`)
  return config
}