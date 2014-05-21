var http = require('http');
var express =	require('express');

var server = express();

server.use(express.static( __dirname + '/../conexion1'));

http.createServer(server).listen(3000, function () {
	console.log('Servidor esta listo %d', this.address().port )
});




