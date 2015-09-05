var express = require('express')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static('public'))

var currentConnection = 0

io.on('connection', function (client) {
  console.log(client.sessionId + ' connected')
  client.broadcast.emit('user connected')

  currentConnection++
  var msg = {
    currentConnection: currentConnection,
    type: 'currentConnection'
  }
  client.broadcast.send(JSON.stringify(msg))
  client.send(JSON.stringify(msg))

  client.on('message', function (message) {
    // do stuff
    // client.broadcast(message)

    var data = JSON.parse(message)

    client.broadcast.send(message)
    if (data.type != 'drag') {
      client.send(message)
    }
    console.log('message: ' + message)
  })

  client.on('disconnect', function () {
    var c = currentConnection - 1
    var msg = {
      currentConnection: c,
      type: 'currentConnection'
    }
    client.broadcast.send(JSON.stringify(msg))
    currentConnection--

  // console.log(client.sessionId + ' disconnected')
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
