import http from 'http'
import Koa from 'koa'
import convert from 'koa-convert'
import bodyParser from 'koa-bodyparser'
import session from 'koa-generic-session'
import MongoStore from 'koa-generic-session-mongo'
import { Server as WebSocket } from 'ws'
import websocket from './services/websocket'
import logger from './common/logger'
import { port, mongoUrl, sessionKeys, cookieKey } from './config'
import router from './router'

const app = new Koa()

app.keys = sessionKeys
app.use(convert(session({
  store: new MongoStore({ url: mongoUrl }),
  key: cookieKey
})))
// app.use(convert(session()))

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
websocket(server) 
server.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
