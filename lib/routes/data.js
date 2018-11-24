const validateAddress = address => address.length == 5 && address.every(x => x >= 0 && x < 256)
const validateData = data => data.length <= 32 && data.every(x => x >= 0 && x < 256)

module.exports = (req, res) => {
  const params = req.body
  if (!validateAddress(params.address)) {
    res.status(500).send('Invalid address, must be 5 byte values')
    return
  }
  if (!validateData(params.data)) {
    res.status(500).send('Invalid data, cannot be more than 32 byte values')
    return
  }
  const byte_values = [...params.address, ...params.data, ...[...new Array(32)].map(() => 0)]
  const data = new Uint8Array(new Buffer(byte_values.slice(0, 37)))

  req.context.serialport.write(data, function(err) {
    if (err) {
      console.log('serial write err ' + err)
    } else {
      res.send('thanks')
    }
  })
}
