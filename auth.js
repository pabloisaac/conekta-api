const md5 = require('MD5')
const { resError } = require('./errors')

exports.login = (db, secret, jwt) => (req, res) => {
  const { credentials } = req.body
  if (!credentials) {
    return resError(res, 'SERVER_ERROR')
  }
  credentials.password = md5(credentials.password)
  db.collection('users').findOne(credentials,
    (err, usr) => {
      if (err || usr === null) {
        return resError(res, 'INVALID_CREDENTIALS')
      }
      usr.token = jwt.sign(usr, secret, { expiresIn: 60 * 60 })
      delete usr.password
      delete usr.username
      return res.json(usr)
    }
  )
}

exports.signup = (db) => async (req, res) => {
  const { signup } = req.body
  if (!signup) {
    return resError(res, 'SERVER_ERROR')
  }
  const { username, password } = signup
  const usr = await db.collection('users').findOne({ username })
  if (usr) {
    return resError(res, 'UNPROCESSABLE_ENTITY')
  }
  const token = md5(Date())
  const data = {
    password: md5(password),
    token,
    username
  }
  await db.collection('users').insertOne(data)
  res.json({ res: 'OP_OK', data })
}
