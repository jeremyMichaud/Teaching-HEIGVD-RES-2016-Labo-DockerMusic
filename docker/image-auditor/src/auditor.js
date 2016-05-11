var protocol = require('./auditor-protocol');
var moment = require('moment');
var dgram = require('dgram');

instrument = {
	"ti-ta-ti": "piano",
	"pouet": "trumpet",
	"trulu": "flute",
	"gzi-gzi": "violin",
	"boum-boum": "drum"
};

musicians = {};

var s = dgram.createSocket('udp4');

s.bind(protocol.PROTOCOL_PORT, function() {
	console.log("Joining multicast group");
	s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});


s.on('message', function(msg, source) {
	musician = source.address + " " + source.port;
	if(!musicians[musician]){
		musicians[musician] = {};
		musicians[musician]["uuid"] = JSON.parse(msg)["uuid"];
		musicians[musician]["activeSince"] = moment();

	}
	musicians[musician]["instrument"] = instrument[JSON.parse(msg)["music"]];
	musicians[musician]["time_remaining"] = 5;
});

var net = require('net');

var server = net.createServer(function(socket) {
	var message = [];
	for(var key in musicians){
		message.push({
			"uuid": musicians[key]["uuid"],
			"instrument": musicians[key]["instrument"],
			"activeSince": musicians[key]["activeSince"],
		});
	}

	socket.write(JSON.stringify(message));
	socket.pipe(socket);
	socket.destroy();
});

server.listen(2205, '0.0.0.0');


setInterval(function(){
	console.log("Musicians connected : ");
	for(var key in musicians){
		console.log(key + " : " + musicians[key]["uuid"] + " : " + musicians[key]["instrument"] + " : " + musicians[key]["time_remaining"]);
		if(--musicians[key]["time_remaining"] == 0){
			delete(musicians[key]);
		}
	}
}, 1000);
