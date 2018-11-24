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

| Type ID | Type | Description |
| ------- | ---- | ----------- |
| 1 | Temperature | Temperature sensor |

### Temperature

A sensor broadcasting the temperature in Celcius.

| byte | desc |
| - | - |
| 0 | sensor id |
| 1 | type id |
| 2 | battery (0 - 254 as percentage and 255 for no battery) |
| 3-4 | MSB value of temp * 100. (temp = (data[3]*256 + data[4]) / 100) |
