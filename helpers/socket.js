const socketIO = require('socket.io')
const http = require('http')


var socket = {}


/**
 * Initilaizes socket.io
 */
socket.init = function (server) {
  socket.io = socketIO(server)

  // connect and disconnect handlers
  socket.io.on('connection', (s) => {
    console.log('Client connected')
    s.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
}


module.exports = socket