let socketio = require('socket.io')

let server = http => {
	let io = socketio(http)

	io.on('connection', socket => {
		console.log('New user connected!')
	})
}

module.exports = server