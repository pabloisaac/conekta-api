const port = process.env.PORT || 7777
const host = process.env.HOST || 'localhost'
const domain = `http://${host}:${port}`

const config = {
  APP: {
    DB_URL: `mongodb://localhost:27017/${process.env.DB_NAME || 'records-db'}`,
    DB: process.env.DB_NAME || 'records-db',
    PORT: process.env.PORT || port,
    SECRET_TOKEN:'4$4bmQH23+$IFTRMv34R5seffeceE0EmC8YQ4o$'
  }
}

exports.init = (app) => {
  const mode = app.get('env')
  console.log(`[*] MODE: ${mode}`)
  console.log(`[*] DOMAIN: ${domain}`)
  return config
}