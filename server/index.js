let socketio = require('socket.io')

let server = http => {
	console.log('Socket servers starting')
	let io = socketio(http)

	io.on('connection', socket => {
		console.log('New user connected!')
		let player = {}

		socket.on('set-username', username => {
			player.name = username

			io.emit('player-connected', {
				name: player.name
			})
		})

		socket.on('set-position', position => {
			player.position = position

			io.emit('player-position', player)
		})

		socket.on('message', message => {
			io.emit('message', {
				message,
				username: player.name
			})
		})

		socket.on('disconnect', () => {
			console.log('User disconnected')
			io.emit('player-disconnected', player)
		})

	})
	return io;
}

module.exports = server