import http from 'http'
import Koa from 'koa'
import convert from 'koa-convert'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import { Server as WebSocket } from 'ws'
import logger from './common/logger'
import { port, sessionKeys, cookieKey } from './config'
import router from './router'

const app = new Koa()

app.keys = sessionKeys
app.use(convert(session({ key: cookieKey })))
app.use(convert(bodyParser()))
app.use(router.routes())
app.use(router.allowedMethods())

// app.use(async ctx => {
//   ctx.throw(404, 'Not Found')
// })

app.on('error', (err, ctx) => {
  if (err.status !== 404) {
    logger.log('error', 'server error', err)
  }
  ctx.status = err.status || 500
  ctx.message = err.message || 'server error'
})

const server = http.createServer(app.callback())
const ws = new WebSocket({ server })
ws.on('connection', socket => {
  console.log('one connection');
  // const location = url.parse(ws.upgradeReq.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  socket.on('message', message => {
    console.log('received: %s', message)
    socket.send('something')
  })
  socket.send('something')
})

// const io = socketIO(server)
//
// io.on('connection', socket => {
//   console.log('new connection');
//   socket.on('message', (data, cb) => {
//     console.log('message');
//   })
//
//   socket.on('disconnect', () => {
//   })
// })

server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
