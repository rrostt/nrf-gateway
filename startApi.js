const api = require('./lib/api')

api.start(
  {
    write(data, cb) {
      console.log(data)
      cb()
    },
  },
  3000
)
