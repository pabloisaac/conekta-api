'use strict'

const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const settings = require('./config')
const auth = require('./auth')

const {
    gLst,
    gGet,
    gPut,
    gDel,
    gPost
  } = require('./api')
const app = express()
const config = settings.init(app)
const secret = process.env.SEED

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use('/api/', expressJwt({ secret: secret, algorithms: ['HS256'] }))

MongoClient.connect(config.APP.DB_URL, { useUnifiedTopology: true },
    (err, conn) => {
        if (err) return console.log('Unable to connect to mongodb', err)

        const db = conn.db(config.APP.DB)

        // auth entrypoints
        app.post('/signup', auth.signup(db))
        app.post('/login', auth.login(db, secret, jwt))

        // generic api
        app.get('/api/:entity/lst', gLst(db))
        app.get('/api/:entity/get/:_id', gGet(db))
        app.delete('/api/:entity/del/:_id', gDel(db))
        app.put('/api/:entity/put', gPut(db))
        app.post('/api/:entity/post', gPost(db))
        

        app.listen(config.APP.PORT, () => {
            console.log(`[*] Database URL ${config.APP.DB_URL}`)
            console.log(`[*] Server Listening on port ${config.APP.PORT}`)
        })
    }
)