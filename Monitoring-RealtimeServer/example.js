var SerialPort  = require("serialport").SerialPort;	// lee la libreria serialport
var portName = "/dev/ttyUSB0";				// establece el nombre del puerto
var fs = require("fs");					// lee la libreria fs
var url = require("url");				// lee la libreria url

// static file http server
// serve files for application directory

var root = "web";					
var http = require("http").createServer(handle);	//lee la libreria http y crea el servidor

function handle (req, res) {				// se crea la funcion handle
	var request = url.parse(req.url, false);		
	console.log("Serving request: " + request.pathname);	// se muestra un mensaje en la consola
	
	var filename = request.pathname;			// se crea un variable con el nombre de un archivo
	
	if(filename == "/") { filename = "/index.html"; }	// asignacion por defecto
	
	filename = root + filename;				// se establece la direccion del archivo

	try {						
		fs.realpathSync(filename);		// se intenta conexion con el archivo
	} catch (e) {
		res.writeHead(404);			// devuelve error en caso de no encontrar el archivo
		res.end();
	}

	var contentType = "text/plain";

	if (filename.match(".js$")) {
		contentType = "text/javascript";
	} else if (filename.match(".html$")) {
		contentType = "text/html";
	}

	fs.readFile(filename, function(err, data) {
		if (err) {
			res.writeHead(500);
			res.end();
			return;
		}

		res.writeHead(200, {"Content-Type": contentType});
		res.write(data);
		res.end();
	});	
}

http.listen(9090);					// se inicia la escucha del servidor

console.log("server started on localhost:9090");	// mensaje en la consola

var io = require("socket.io").listen(http); // server listens for socket.io communication at port 8000
io.set("log level", 1); // disables debugging. this is optional. you may remove it if desired.

var sp = new SerialPort(portName, {
	baudrate: 9600					// se establece la velocidad de la lectura serial
}); // instantiate the serial port.

sp.on("close", function (err) {				// se realiza el evento de sp puerto cerrado
  console.log("port closed");				// se muestra mensaje en la consola
});

sp.on("error", function (err) {				// se realiza el evento de sp error
  console.error("error", err);				// se muestra el mensaje de error
});

sp.on("open", function () {					// se realiza el evento de sp abierto
  console.log("port opened... Press reset on the ARDUINO.");	// se muestra el mensaje para reiniciar el arduino
});

io.sockets.on("connection", function (socket) {
    // If socket.io receives message from the client browser then 
    // this call back will be executed.
    socket.on("message", function (msg) {
        console.log(msg);
    });
    // If a web browser disconnects from Socket.IO then this callback is called.
    socket.on("disconnect", function () {
        console.log("disconnected");
    });
});

var cleanData = ""; // this stores the clean data
var readData = "";  // this stores the buffer
sp.on("data", function (data) { // call back when data is received
	
	console.log("serial port: " + data.toString());
	
    readData += data.toString(); // append data to buffer
    // if the letters "A" and "B" are found on the buffer then isolate what"s in the middle
    // as clean data. Then clear the buffer.
    if (readData.indexOf("B") >= 0 && readData.indexOf("A") >= 0) {
        cleanData = readData.substring(readData.indexOf("A") + 1, readData.indexOf("B"));
        readData = "";
        io.sockets.emit("message", cleanData);
    }
});
