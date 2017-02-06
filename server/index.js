let socketio = require('socket.io')
let shortid = require('shortid')

let PROPS = require('./properties')

let Alerts = require('./components/Alerts')
let Player = require('./models/Player')
let Players = require('./models/Players')
let CashStore = require('./models/CashStore')

let commands = require('./components/Commands')
let Actions = require('./components/Actions')

let {
	Generators,
 	GENERATE_DOLLAR,
 	RESTORE_ENERGY,
 	RESTORE_HP 
 	} = require('./components/Generators')


let server = http => {
	console.log('Socket servers starting')
	let io = socketio(http)

	let playersSocket = io.of('/players')
	let messagesSocket = io.of('/messages')
	let cashSocket = io.of('/cash')
	let alerts = new Alerts(io.of('/alerts'))


	let players = new Players({playersSocket});
	let cashStore = new CashStore({cashSocket});


	let actions = Actions({io, playersSocket, alerts})

	playersSocket.on('connection', socket => {
		players.all.forEach(player => player.publicUpdate())
	})

	cashSocket.on('connection', socket => {
		socket.emit('all', cashStore.cash)
	})

	//== START GENERATORS HERE
	generators = new Generators({cashStore, players})
	let dollarGenerator = generators.startInterval(GENERATE_DOLLAR, 2000)
	let energyGenerator = generators.startInterval(RESTORE_ENERGY, 5000)
	let hpGenerator = generators.startInterval(RESTORE_HP, 5000)


	io.on('connection', socket => {
		let player = new Player({socket, playersSocket })
		console.log(`[${player.id}] NEW CONNECTION`.green)

		players.push(player)

		socket.on('set-name', name => player.attributes = {name})

		socket.on('command', ({command, params}) => commands.execute(
			{command, params},
			{
				player, players, alerts, 
				generateDollars: (number) => {
					for(let i=0; i<(number > 50 ? 50 : number); i++) {
						// generators.runOnce(GENERATE_DOLLAR)
						setTimeout(() => generators.runOnce(GENERATE_DOLLAR), 150*i)
					}
				}
			}
		));

		socket.on('set-position', position => {
			if(!player.dead) {
				player.position = position
			}
		})

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

			playersSocket.emit('left', player.id)
			players.remove(player)
		})
	})

	return io;
}

module.exports = server