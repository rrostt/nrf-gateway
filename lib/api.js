var express = require('express')
var bodyParser = require('body-parser')
var app = express()

function start(serialport, portnumber) {
  app.use(bodyParser.json())

  app.get('/', function(req, res) {
    res.send('hello')
  })

  app.get('/test', function(req, res) {
    var data = new Uint8Array(
      new Buffer([
        69,
        68,
        67,
        66,
        101,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ])
    )
    serialport.write(data, function(err) {
      if (err) {
        // error
        console.log('serial write err ' + err)
      } else {
        res.send('thanks')
      }
    })
  })

  app.post('/data', function(req, res) {
    var params = req.body
    var byte_values = []
    byte_values = byte_values.concat(params.address)
    byte_values = byte_values.concat(params.data)
    var data = new Uint8Array(new Buffer(byte_values))

    serialport.write(data, function(err) {
      if (err) {
        // error
        console.log('serial write err ' + err)
      } else {
        res.send('thanks')
      }
    })
  })

  var server = app.listen(portnumber, function() {
    console.log(`Listening on port ${portnumber}`)
  })

  return server
}

module.exports = {
  start,
}
