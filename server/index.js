let socketio = require('socket.io')
let shortid = require('shortid')

let server = http => {
	console.log('Socket servers starting')
	let io = socketio(http)
	let players = [];

	io.on('connection', socket => {
		let player = {
			id: shortid.generate(),
			position: {
				x: 100,
				y: 100
			}
		}
		console.log(`[${player.id}]`.yellow + ` connected`.green)
		socket.emit('your-id', player.id)


		socket.on('set-username', username => {
			player.name = username

			players.push(player)
			console.log(`[${player.id}]`.yellow + ` Set username: ` + `${username}`.green)

			io.emit('player-new', player)
			io.emit('players', players)
		})

		socket.on('set-position', position => {
			console.log(`[${player.id}]`.yellow + ` Moved to: ` + `[${position.x},${position.y}]`.green)

			player.position = position

			io.emit('player-position', {
				playerId: player.id,
				position: player.position
			})
		})

		socket.on('message', message => {
			console.log(`[${player.id}]`.yellow + `(${player.name}): ` + `"${message}"`)

			io.emit('message', {
				id: shortid.generate(),
				message,
				playerId: player.id
			})
		})

		socket.on('disconnect', () => {
			console.log(`[${player.id}]`.yellow + `(${player.name})` + ' disconnected'.red)

			io.emit('player-left', player)
			players = players.filter(_player => {return _player.id !== player.id})
		})

	})
	return io;
}

module.exports = server