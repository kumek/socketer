let socketio = require('socket.io')
let shortid = require('shortid')

let PROPS = require('./properties')

let Alerts = require('./components/Alerts')
let Player = require('./models/Player')


let server = http => {
	console.log('Socket servers starting')
	let io = socketio(http)
	let players = [];
	let cash = [];

	let alerts = new Alerts(io.of('/alerts'))


	const printDollar = (recursive = false) => {
		if(cash.length < PROPS.DOLLAR_MAX_NUMBER_ON_MAP) {
			let dollar = {
				id: shortid.generate(),
				value: (Math.random() * (PROPS.DOLLAR_MAX_VALUE-PROPS.DOLLAR_MIN_VALUE)) + PROPS.DOLLAR_MIN_VALUE,
				position: {
					x: Math.floor(Math.random()*900)-50,
					y: Math.floor(Math.random()*900)-50
				}
			}
			console.log('New dollar printed'.blue)
			cash.push(dollar)
			io.emit('cash-new', dollar)
		}

		if(recursive) {
			setTimeout(printDollar.bind(null, true), Math.floor(Math.random()*10000)+5000)
		}
	}

	const distance = (p1, p2) => {
		return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
	}

	printDollar(true)

	const generateDollars = number => {
		for(let i=0; i<number; i++){
			setTimeout(printDollar,i*250) 
		}
	}

	const updatePlayer = (socket, props) => {
		socket.emit('player-update', props)
	}

	const emitAlert = (socket, content) => {
		socket.emit('alert', {
			id: shortid.generate(), 
			content,
			cooldown: 2500
		})
	}

	const regenerateEnergy = (socket, player) => {
		if(player.energy.value !== player.energy.max) {
			if((player.energy.value += PROPS.ENERGY_REGENERATE_VALUE) > player.energy.max) {
				player.energy.value = player.energy.max
			}

			updatePlayer(socket, {
				energy: { 
					value: player.energy.value,
					max: player.energy.max
				}
			})
		}
	}

	io.on('connection', socket => {
		let player = new Player({
			account: 0,
			energy: {
				value: PROPS.ENERGY_DEFAULT_VALUE,
				max: PROPS.ENERGY_DEFAULT_MAX
			},
			position: PROPS.STARTING_POSITION
		})

		console.log(`[${player.id}]`.yellow + ` connected`.green)
		// socket.emit('your-id', player.id)
		updatePlayer(socket, player);


		socket.on('set-username', username => {
			player.name = username
			player.type = PROPS.CHARACTER_TYPES[Math.floor(Math.random() * (PROPS.CHARACTER_TYPES.length - 1))]

			players.push(player)
			console.log(`[${player.id}]`.yellow + ` Set username: ` + `${username}`.green)

			setInterval(regenerateEnergy.bind(this, socket, player), PROPS.ENERGY_REGENERATE_TIME*1000)

			io.emit('player-new', player)
			io.emit('players', players)
			io.emit('cash', cash)
		})

		socket.on('set-type', type => {
			if(player.energy.value < PROPS.ENERGY_COST_CHARACTER) {
				player.alert("Not enough energy!")
				return
			}

			player.energy.value -= PROPS.ENERGY_COST_CHARACTER
			updatePlayer(socket, player)

			console.log(`[${player.id}]`.yellow + ` Set type: ` + `${type}`.green)

			player.type = type

			io.emit('player-type', {
				playerId: player.id,
				type: type
			})
		})

		socket.on('generate', number => {
			if(player.energy.value >= PROPS.ENERGY_COST_GENERATE_DOLLARS) {
				generateDollars(number > PROPS.MAX_DOLLARS_GENERATED ? PROPS.MAX_DOLLARS_GENERATED : number)
				player.energy.value -= PROPS.ENERGY_COST_GENERATE_DOLLARS

				updatePlayer(socket, player)

				// emitAlert(io, )
				alerts.emit(`${player.name} generated ${number} dollars`)
			} else {
				player.alert("Not enough energy")
			}

			
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

		socket.on('cash-grab', id => {
			// Get clicked dollar
			let dollarFound = cash.find(dollar => dollar.id === id)

			if(!dollarFound) {
				player.alert('You missed!')
				// emitAlert(socket, 'You missed!')
				return
			}

			// Check if you are not too far away
			if(distance(dollarFound.position, player.position) > PROPS.DOLLAR_GRAB_DISTANCE) {
				player.alert('Step closer')
				// emitAlert(socket, 'Step closer')
				return
			}

			cash = cash.filter(dollar => dollar.id !== dollarFound.id)

			// All conditions passsed, grab that money
			player.account += dollarFound.value
			socket.emit('dollar-new', dollarFound)
			console.log(dollarFound);
			io.emit('cash-grabbed', {grabbedDollar: dollarFound, playerId: player.id})

		})

		socket.on('backstab', () => {
			if(player.energy.value < PROPS.ENERGY_COST_BACKSTAB) {
				player.alert('Not enough energy!')
				// emitAlert(socket, 'Not enough energy!')

				return
			}

			let deathPlayer = players.find(({id, name, position, dead}) => {
				return (id !== player.id ) && (!dead) &&
				(Math.abs(position.x - player.position.x) < 45) &&
				(position.y - player.position.y < 30) &&
				(position.y - player.position.y > 0)
			})

			if(deathPlayer) {
				

				io.emit('backstabbed', deathPlayer)

				alerts.emit(`${deathPlayer.name} is dead!`)

				deathPlayer.dead = true

				players = players.slice().map(player => {
					return deathPlayer.id === player.id ? deathPlayer : player
				})

			} else {
				player.alert("You didn't hit")
				// emitAlert(socket, "You didn't hit!")
			}

			// After action, reduce energy	
			player.energy.value -= PROPS.ENERGY_COST_BACKSTAB
			updatePlayer(socket, player)
		})

		socket.on('disconnect', () => {
			console.log(`[${player.id}]`.yellow + `(${player.name})` + ' disconnected'.red)
			
			alerts.emit(`${player.name} has left`)

			io.emit('player-left', player)
			players = players.filter(_player => {return _player.id !== player.id})
		})

	})
	return io;
}

module.exports = server