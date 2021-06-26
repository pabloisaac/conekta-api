'use strict'

const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const settings = require('./config')
const auth = require('./auth')
const fs = require('fs');
var https = require('https');
var privateKey = fs.readFileSync('./certs/server.key', 'utf8');
var certificate = fs.readFileSync('./certs/server.cert', 'utf8');
var credentials = { key: privateKey, cert: certificate };

let server;

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use('/api/', expressJwt({ secret: secret, algorithms: ['HS256'] }))

let port = config.APP.PORT
let host = process.env.HOST
let protocol = process.env.PROTOCOL
let db_url = config.APP.DB_URL





// your express configuration here

//var httpServer = http.createServer(app);




MongoClient.connect(db_url, { useUnifiedTopology: true },
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


        // const { execSync } = require('child_process');
        // const execOptions = { encoding: 'utf-8', windowsHide: true };
        // let key = './certs/key.pem';
        // let certificate = './certs/certificate.pem';

        // if (!fs.existsSync(key) || !fs.existsSync(certificate)) {
        //     try {
        //         execSync('openssl version', execOptions);
        //         execSync(
        //             `openssl req -x509 -newkey rsa:2048 -keyout ./certs/key.tmp.pem -out ${certificate} -days 365 -nodes -subj "/C=US/ST=Foo/L=Bar/O=Baz/CN=localhost"`,
        //             execOptions
        //         );
        //         execSync(`openssl rsa -in ./certs/key.tmp.pem -out ${key}`, execOptions);
        //         execSync('rm ./certs/key.tmp.pem', execOptions);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }

        // const options = {
        //     key: fs.readFileSync(key),
        //     cert: fs.readFileSync(certificate),
        //     passphrase: 'password'
        // };

        // server = require('https').createServer(options, app);

        // // Start a development HTTPS server.
        // if (protocol === 'https') {


        // } else {
        //     server = require('http').createServer(app);
        // }

        //server = require('https').createServer(options, app);


        //httpServer.listen(8080);
        //httpsServer.listen(8443);

        var httpsServer = https.createServer(credentials, app);

        httpsServer.listen(port, () => {
            console.log(`[*] Protocol ${protocol}`)
            console.log(`[*] Host ${host}`)
            console.log(`[*] Database URL ${db_url}`)
            console.log(`[*] Server Listening on port ${port}`)
        })

    }
)