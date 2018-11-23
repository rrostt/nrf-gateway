var express = require('express');
var bodyParser = require('body-parser');
var app = express();

function start(serialport, portnumber) {

	app.use(bodyParser.urlencoded({extended: false}));

	app.get('/', function(req, res) {
		res.send("hello");
	});

	app.use('/heart', express.static(__dirname + '/index.html'));

	app.post('/heart', function(req, res) {

		var command = req.param('command');

		var data = new Uint8Array(new Buffer([0xc2, 0xc2,0xc2,0xc2,0xc2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, command[0], 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));

		serialport.write(data,
//		serialport.write(command.substr(0,1),
			function(err, results) {
				if (err) { // error
			        	console.log('serial write err ' + err);
				} else {
					res.send('thanks');
				}
			}
		);

	});

	app.use('/couch', express.static(__dirname + '/couch.html'));

	app.post('/couch', function(req, res) {
		var color= {r:0,g:0,b:0};
		color.r = +req.param('r');
		color.g = +req.param('g');
		color.b = +req.param('b');
		var mode = req.param('mode') || 'r';
		var rotate_speed = +req.param('rotate_speed') || 1000;
		var rs_low = rotate_speed&255;
		var rs_high = (rotate_speed>>8)&255;
		var data = new Uint8Array(new Buffer([0xab, 0xcd, 0xef, 0x01, 0x23, mode.charCodeAt(0), +color.r, +color.g, +color.b, rs_low,rs_high, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));
		serialport.write(
			data,
			function(err,results) {
				if (err) { // error
			        	console.log('serial write err ' + err);
				} else {
					res.send('thanks');
				}
			}
		);
	});

	app.get('/test', function(req, res) {
		var data = new Uint8Array(new Buffer([0xab, 0xcd, 0xef, 0x01, 0x23, 's'.charCodeAt(0), 100, 0, 0, 0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));
		serialport.write(
			data,
			function(err, results) {
				if (err) { // error
					console.log('serial write err ' + err);
				} else {
					res.send('thanks');
				}
			}
		);
	});


	app.post('/data', function(req, res) {
		var param = JSON.parse(req.param('packet-info'));
		var byte_values = [];
		byte_values = byte_values.concat(param.address);
		byte_values = byte_values.concat(param.data);
		var data = new Uint8Array(new Buffer(byte_values));
		serialport.write(
			data,
			function(err, results) {
				if (err) { // error
					console.log('serial write err ' + err);
				} else {
					res.send('thanks');
				}
			}
		);
	});

	var server = app.listen(portnumber, function() {
		//
	});

}

module.exports = {start:start};
