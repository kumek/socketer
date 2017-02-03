let socketio = require('socket.io')
let shortid = require('shortid')

let PROPS = require('./properties')

let Alerts = require('./components/Alerts')
let Player = require('./models/Player')
let CashStore = require('./models/CashStore')

let commands = require('./components/Commands')
let Actions = require('./components/Actions')


let server = http => {
	console.log('Socket servers starting')
	let io = socketio(http)

	let playersSocket = io.of('/players')
	let messagesSocket = io.of('/messages')
	let cashSocket = io.of('/cash')
	let alerts = new Alerts(io.of('/alerts'))


	let players = [];
	let cashStore = new CashStore({cashSocket});


	let actions = Actions({io, playersSocket, alerts})

	playersSocket.on('connection', socket => {
		players.forEach(player => player.publicUpdate())
	})

	cashSocket.on('connection', socket => {
		socket.emit('all', cashStore.cash)
	})

	io.on('connection', socket => {
		let player = new Player({socket, playersSocket })
		console.log(`[${player.id}] NEW CONNECTION`.green)

		players.push(player)

		socket.on('set-name', name => player.attributes = {name} )

		socket.on('command', ({command, params}) => commands.execute({command, params}, {player, players, alerts, generateDollars}))

		socket.on('set-position', position => player.position = position)

		socket.on('message', message => {
			console.log(`[${player.id}]`.yellow + `(${player.name}): ` + `"${message}"`)

			io.emit('message', {
				id: shortid.generate(),
				message,
				playerId: player.id
			})
		})

		socket.on('cash-grab', actions.grabCash({cashStore, player}))

		socket.on('disconnect', () => {
			console.log(`[${player.id}](${player.name || 'not-logged'}) DISCONNECTED`.red)

			
			alerts.emit(`${player.name} has left`)

			// io.emit('player-left', player.id)
			playersSocket.emit('left', player.id)
			players = players.filter(_player => {return _player.id !== player.id})
		})
	})


	//TODO: Put this down to generators
	const printDollar = (recursive = false) => {
		if(cashStore.cash.length < PROPS.DOLLAR_MAX_NUMBER_ON_MAP) {
			let dollar = {
				id: shortid.generate(),
				value: (Math.random() * (PROPS.DOLLAR_MAX_VALUE-PROPS.DOLLAR_MIN_VALUE)) + PROPS.DOLLAR_MIN_VALUE,
				position: {
					x: Math.floor(Math.random()*900)-50,
					y: Math.floor(Math.random()*900)-50
				}
			}
			cashStore.putDollar(dollar)
		}

		if(recursive) {
			setTimeout(printDollar.bind(null, true), Math.floor(Math.random()*10000)+5000)
		}
	}


	printDollar(true)

	const generateDollars = number => {
		for(let i=0; i<number; i++){
			setTimeout(printDollar,0)
		}
	}

	return io;
}

module.exports = server