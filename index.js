var serialport = require("serialport");
var dateformat = require("dateformat");
var api = require('./api.js');
var mqtt = require('mqtt')
require('dotenv').config()

const client = mqtt.connect(process.env.MQTT_HOST, { username: process.env.MQTT_USERNAME, password: process.env.MQTT_PASSWORD })

client.on('connect', function () {
  console.log('connected to mqtt!', client.connected)
})

var initialized = false;

var sp = new serialport.SerialPort("/dev/ttyUSB0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

api.start(sp,3000);

sp.on("open", function () {
  sp.on('data', function(data) {

    if (data.indexOf("Hello")==0) {
      initialized = true;
      return;
    }

    if (!initialized) return;

    var parts = data.split(" ");
    var temp = +parts[1];
    var sensor_id = +parts[2];
    var voltage = +parts[3];

    var now = dateformat(new Date(), "yyyy-mm-dd HH:MM:ss");
    console.log(now + "\t" + temp + "\t" + sensor_id + "\t" + voltage);

    if (client.connected) {
      client.publish(`home/nrf24l01/${sensor_id}`, JSON.stringify({
        sensorId: sensor_id,
        temp,
        voltage,
        datestring: now
      }))
    }
  });
});

process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    sp.write(chunk.substr(0,1), function(err, results) {
      if (err) { // error
        console.log('serial write err ' + err);
      }
    });
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});

