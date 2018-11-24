const serialport = require('serialport')
const api = require('./api.js')
const mqtt = require('mqtt')
require('dotenv').config()

const client = mqtt.connect(
  process.env.MQTT_HOST,
  { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD }
)

client.on('connect', function() {
  console.log('connected to mqtt!', client.connected)
})

var sp = new serialport.SerialPort('/dev/ttyUSB0', {
  baudrate: 115200,
  parser: serialport.parsers.readline('\n'),
})

const sensors = {
  1: {
    type: 'temperature',
    parse(parts) {
      return {
        temp: (parts[3] * 256 + parts[4]) / 100,
        type: 'temp',
      }
    },
  },
  2: {
    type: 'door',
    parse(parts) {
      return {
        open: parts[3] === 1,
        type: 'door',
      }
    },
  },
}

api.start(sp, 3000)

sp.on('open', function() {
  sp.on('data', function(data) {
    console.log('Line: ', data)

    if (data.indexOf('Data ') !== 0) return

    const parts = data
      .substr(5)
      .split(', ')
      .map(x => +x)

    const id = parts[0]
    const type = parts[1]
    const voltage = parts[2]

    if (!sensors[type]) {
      console.error('Unknown sensor type ', type)
      return
    }

    const parsed = sensors[type].parse(parts)

    if (client.connected) {
      const sensorData = {
        sensorId: id,
        type,
        voltage,
        timestamp: Date.now(),
        ...parsed,
      }
      console.log('sensor', JSON.stringify(sensorData, null, 2))
      //      client.publish(`home/nrf24l01/${id}`, JSON.stringify(sensorData));
    }
  })
})
