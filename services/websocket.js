import { Server as WebSocket } from 'ws'

const clients = {}
const rooms = {}
let roomNo = 0

function handleMessage(socket, message) {
  const { type, openid, payload = {} } = message
  switch (type) {
    case 'connection':
      clients[openid] = { socket, state: 1 }
      console.log('current clients', clients);

      break;
    case 'createRoom':
      clients[openid].room = ++roomNo
      rooms[roomNo] = {
        members: [openid]
      }
      console.log('current clients', clients);

    default:

  }
}

export default function(server) {
  const ws = new WebSocket({ server })
  ws.on('connection', socket => {
    console.log('one connection');
    // const location = url.parse(ws.upgradeReq.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

    socket.on('close', obj => {
      console.log('connection is close.', obj);
    })

    socket.on('message', message => {
      try {
        const obj = JSON.parse(message)
        handleMessage(socket, obj)
        socket.send(message)
      } catch (e) {
        console.log(e);
      }
    })
    socket.send('something')
  })
}
