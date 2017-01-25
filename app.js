var express = require('express')
var app = express();
var http = require('http').Server(app);
// var io = require('socket.io')(http)

var color = require('colors');
var path = require('path');

const PORT = 4666;

// Set socket server
let socketServer = require('./server')(http)

// Set resources
app.use('/resources', express.static(path.join(__dirname, 'dist/resources')))

// Server main page
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start server
http.listen(PORT, function() {
	console.log(`App has started on port: ${PORT}`.green);
});
