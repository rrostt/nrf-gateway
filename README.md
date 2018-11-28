# Sensor network thingie

Home gateway for communicating with nRF24L01+ sensors spread around my house.

Communicates with /dev/ttyUSB0. Probably requires sudo.

Forwards data to mqtt server.

## Config

Create .env with

| ENV VAR | Description |
| - | - |
| MQTT_HOST | mqtt hostname (e.g. mqtt://localhost) |
| MQTT_USERNAME | mqtt username |
| MQTT_PASSWORD | mqtt password |


## Sensors

Sensors are identified by id and type. The type IDs are:

| Type ID | Type | Description |
| ------- | ---- | ----------- |
| 1 | Temperature | Temperature sensor |
| 2 | Door sensor | Door sensor |

All emit a message on mqtt in topic `home/nrf24l01/{id}` where `{id}` is the id of the sensor.

### Temperature

A sensor broadcasting the temperature in Celcius.

| byte | desc |
| - | - |
| 0 | sensor id |
| 1 | type id |
| 2 | battery (0 - 254 as percentage and 255 for no battery) |
| 3-4 | MSB value of temp * 100. (temp = (data[3]*256 + data[4]) / 100) |

Message looks like

```
{
  sensorId: ID of the sensor
  voltage: value between 0-254 indicating % of charge, or 255 indicating no battery or voltage unknown.
  type: 'temp'
  timestamp: epoch in milliseconds
  temp: the temperature reading in degrees celcius
}
```

### Door

| byte | desc |
| - | - |
| 0 | sensor id |
| 1 | type id |
| 2 | battery (0 - 254 as percentage and 255 for no battery) |
| 3 | 1 if open and 0 if closed |

Message looks like

```
{
  sensorId: ID of the sensor
  voltage: value between 0-254 indicating % of charge, or 255 indicating no battery or voltage unknown.
  type: 'door'
  timestamp: epoch in milliseconds
  open: true of the door is open and false if it is closed
}
```
