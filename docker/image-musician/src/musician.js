var protocol = require('./musician-protocol');
var dgram = require('dgram');
var uuid = require('node-uuid');

const musicians = {
	"piano": "ti-ta-ti",
	"trumpet": "pouet",
	"flute": "trulu",
	"violin": "gzi-gzi",
	"drum": "boum-boum"
};


var s = dgram.createSocket('udp4');

function Musician(name, uuid){
	this.name = name;
	this.uuid = uuid;
	this.data = {
		"uuid": this.uuid,
		"music": musicians[name]
	};
	this.payload = JSON.stringify(this.data);

	Musician.prototype.update = function(){
		message = new Buffer(this.payload);
		s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
			console.log("Sending song: " + message + " via port " + s.address().port);
		});
	};

	setInterval(this.update.bind(this), 1000);
}

var m = new Musician(process.argv[2], uuid.v4());
