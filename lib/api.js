var express = require('express')
var bodyParser = require('body-parser')
var app = express()

function start(serialport, portnumber) {
  app.use(bodyParser.json())

  app.use((req, res, next) => {
    req.context = {
      serialport,
    }
    next()
  })

  app.get('/', function(req, res) {
    res.send('hello')
  })

  app.get('/test', require('./routes/test'))

  app.post('/data', require('./routes/data'))

  var server = app.listen(portnumber, function() {
    console.log(`Listening on port ${portnumber}`)
  })

  return server
}

module.exports = {
  start,
}
