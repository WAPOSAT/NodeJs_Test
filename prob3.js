 var express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io').listen(server),
      arduino = require('./arduino');

  server.listen(8000);

  // Sets the /public folder as the document root
  app.use(express.static(__dirname + '/public'));

  // Serves the index page by default
  app.get("/", function(req, res) {
    res.sendfile(__dirname + "/index.html");
  });
