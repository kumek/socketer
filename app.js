var http = require('http');
var express = require('express');
var color = require('colors');
var path = require('path');

var app = express();

const PORT = 4666;

// Set socket server
let socketServer = require('./server')(http)

// Set resources
app.use('resources', express.static(path.join(__dirname, 'dist/public')));


// Server main page
app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start server
app.listen(PORT, function() {
	console.log(`App has started on port: ${PORT}`.green);
});
