let socketio = require('socket.io')
let shortid = require('shortid')

let server = http => {
	console.log('Socket servers starting')
	let io = socketio(http)
	let players = [];
	let cash = [];

	const printDollar = () => {
		let dollar = {
			id: shortid.generate(),
			value: 1,
			position: {
				x: Math.floor(Math.random()*900)-50,
				y: Math.floor(Math.random()*900)-50
			}
		}
		console.log('New dollar printed')
		cash.push(dollar)
		io.emit('cash-new', dollar)
		setTimeout(printDollar, Math.floor(Math.random()*10000)+5000)
	}

	printDollar()

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
			io.emit('cash', cash)
		})

		socket.on('set-type', type => {
			console.log(`[${player.id}]`.yellow + ` Set type: ` + `${type}`.green)

			player.type = type

			io.emit('player-type', {
				playerId: player.id,
				type: type
			})
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

		socket.on('backstab', () => {
			let deathPlayer = players.find(({id, name, position, dead}) => {
				return (id !== player.id ) && (!dead) &&
				(Math.abs(position.x - player.position.x) < 45) &&
				(position.y - player.position.y < 30) &&
				(position.y - player.position.y > 0)
			})

			if(deathPlayer) {
				io.emit('backstabbed', deathPlayer)
				io.emit('alert', {
					id: shortid.generate(),
					content: `${deathPlayer.name} is dead!`,
					cooldown: 2500
				})

				deathPlayer.dead = true

				players = players.slice().map(player => {
					return deathPlayer.id === player.id ? deathPlayer : player
				})

			} else {
				socket.emit('alert', {
					id: shortid.generate(),
					content: "You didn't hit!",
					cooldown: 2500
				})
			}
		})

		socket.on('disconnect', () => {
			console.log(`[${player.id}]`.yellow + `(${player.name})` + ' disconnected'.red)
			io.emit('alert', {
				id: shortid.generate(),
				content: `${player.name} has left`,
				cooldown: 2000
			})
			io.emit('player-left', player)
			players = players.filter(_player => {return _player.id !== player.id})
		})

	})
	return io;
}

module.exports = server