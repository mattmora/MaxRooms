'use strict'

// https://medium.com/@markcolling/integrating-socket-io-with-next-js-33c4c435065e
// https://github.com/mars/heroku-nextjs-custom-server-express/blob/master/server.js

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000

const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const next = require('next')
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

const AppGameEngine = require('./engine/AppGameEngine')
const AppServerEngine = require('./engine/AppServerEngine')
const { Lib } = require('lance-gg')

const gameEngine = new AppGameEngine({ traceLevel: Lib.Trace.TRACE_NONE })
const serverEngine = new AppServerEngine(io, gameEngine, { traceLevel: Lib.Trace.TRACE_NONE, timeoutInterval: 1800 })

nextApp.prepare().then(() => {

    app.get('*', (req, res) => {
        return nextHandler(req, res)
    })

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })

    serverEngine.start();
})