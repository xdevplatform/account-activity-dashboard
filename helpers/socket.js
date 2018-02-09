const socketIO = require('socket.io')
const http = require('http')
const uuid = require('uuid/v4')


var socket = { }

socket.activity_event = 'activity_event_' + uuid()


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