module.exports = (req, res) => {
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
  req.context.serialport.write(data, function(err) {
    if (err) {
      console.log('serial write err ' + err)
    } else {
      res.send('thanks')
    }
  })
}
