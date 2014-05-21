var http = require('http');
var express = require('express');

var server = express ();

server.use (express.static(__dirname + '/../Camara-View'));

http.createServer (server).listen(3000, function(){
    console.log('Sevidor esta listo %d ',this.address().port);
});
