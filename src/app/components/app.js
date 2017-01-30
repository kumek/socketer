import React, { Component } from 'react'
import TextInput from './TextInput/TextInput'
import Room from './Room/Room'
import LoginForm from './LoginForm/LoginForm'
import Alerts from './Alerts/Alerts'

export default class App extends Component {
	constructor(props) {
		super();

		console.log('app.js constructor run')

		super(props);

		this.state = {
			message: '',
			messages: [],
			player: {
				account: 0
			},
			players: [],
			alerts: [],
			cash: [],
		}

		// Binding
		this.setMessage = this.setMessage.bind(this)
		this.sendMessage = this.sendMessage.bind(this)
		this.sendPlayerName = this.sendPlayerName.bind(this)
		this.setPlayerPosition = this.setPlayerPosition.bind(this)
		this.fadeMessage = this.fadeMessage.bind(this)
		this.onEnterMessage = this.onEnterMessage.bind(this)
		this.setPlayerType = this.setPlayerType.bind(this)
		this.dismissAlert = this.dismissAlert.bind(this)
		this.fadeAlert = this.fadeAlert.bind(this)

		// Sockets emiting
		window.socket.on('message', ({id, message, playerId}) => {
			let messages = this.state.messages.slice()
			messages.push({
				id,
				content: message,
				position: this.state.players.find(player => player.id === playerId).position
			})
			this.setState({messages})
			this.fadeMessage({id, cooldown: 2000})
		})

		window.socket.on('alert', alert => {
			console.log('Alert: ')
			let alerts = this.state.alerts.slice()
			alerts.push(alert)
			this.setState({alerts})

			if(alert.cooldown) this.fadeAlert(alert)
		})

		window.socket.on('players', players => {
			this.setState({players})
		})

		window.socket.on('cash', cash => {
			this.setState({cash})
		})

		window.socket.on('player-type', ({playerId, type}) => {
			let players = this.state.players.map(player => {
				return (playerId === player.id ? Object.assign({}, player, {type}) : player)
			})
		})

		window.socket.on('your-id', (id) => {
			console.log(`You received your id: ${id}`)
			this.setState({
				player: Object.assign({}, this.state.player, {id})
			})
		})

		window.socket.on('player-type', ({playerId, type}) => {
			console.log(`Player ${playerId} changed to be ${type}`)
			let players = this.state.players.map(player => {
				return (playerId === player.id ? Object.assign({}, player, {type}) : player)
			})

			this.setState({players})
		})

		window.socket.on('player-position', ({playerId, position}) => {
			console.log(`Player ${playerId} moved to ${position.x},${position.y}`)
			let players = this.state.players.slice().map(player => {
				return (playerId === player.id ? Object.assign({}, player, {position}) : player)
			})
			players.sort((p1, p2) => {
				return p1.position.y - p2.position.y
			})
			this.setState({players})
		})

		window.socket.on('player-new', player => {
			let players = this.state.players.slice()
			players.push(player)
			console.log(`${player.name}[${player.id}] has joined`);
			this.setState({players})
		})

		window.socket.on('player-left', player => {
			let players = this.state.players.filter(_player => _player.id !== player.id);
			console.log(`${player.name}[${player.id}] has left`);
			this.setState({players});
		})

		window.socket.on('backstabbed', ({id, name}) => {
			let players = this.state.players.slice().map(player => (player.id === id ? Object.assign({}, player, {dead: true}) : player))
			console.log(players)
			this.setState({players})
			console.log(`${name} has beed backstabbed! He's dead :(`)
		})

		window.socket.on('cash-new', dollar => {
			console.log('New dollar appeared')
			let cash = this.state.cash.slice()
			cash.push(dollar)
			this.setState({cash})
		})

		window.socket.on('cash-grabbed', ({id}) => {
			console.log('Somebody grabbed cash!')
			this.setState({cash: this.state.cash.filter(dollar => dollar.id !== id)})
		})

		window.socket.on('dollar-new', ({value}) => {
			console.log(`You catched this dollar! ${value}`)
			this.setState({
				player: Object.assign({}, this.state.player,
					{
						account: this.state.player.account + value
					}
				)
			})
		})
	}

	// Fade message after time
	fadeMessage({id, cooldown}) {
		setTimeout(() => {
			let messages = this.state.messages.filter(message => message.id !== id)
			this.setState({messages})
		}, cooldown)
	}
	
	fadeAlert({id, cooldown}) {
		setTimeout(() => {
			let alerts = this.state.alerts.filter(alert => alert.id !== id)
			this.setState({alerts})
		}, cooldown)
	}

	// State setters
	setPlayerName(name) {
		this.setState({
			player: Object.assign({}, this.state.player, {name})
		})
	}

	setPlayerType(type) {
		console.log(`Changed type to ${type}`)
		this.setState({
			player: Object.assign({}, this.state.player, {type})
		})

		window.socket.emit('set-type', type)
	}

	setPlayerPosition(position) {
		console.log(`New position [${position.x},${position.y}]`)
		window.socket.emit('set-position', position);

		this.setState({
			player: Object.assign({}, this.state.player, { position })
		})
	}

	setMessage(message) {
		this.setState({message})
	}

	sendPlayerName(name) {
		if(name.split('')[0])
		this.setState({
			player: Object.assign({}, this.state.player, { name })
		})
		window.socket.emit('set-username', name)
	}

	onEnterMessage() {
		if(this.state.message[0] === '/') {
			let cmd = this.state.message.slice(1)
			this.runCommand(cmd.split(' '))
		} else {
			this.sendMessage(this.state.message)
		}
	}

	sendMessage() {
		console.log('Sending message')
		window.socket.emit('message', this.state.message)
		this.setState({ message: '' })
	}

	backstabPlayer() {
		window.socket.emit('message', 'Backstabbed!')
		window.socket.emit('backstab')
	}

	runCommand([command, ...params]) {
		switch(command) {
			case 'character' :
				this.setPlayerType(params[0])
				break
			case 'backstab' :
				this.backstabPlayer()
				break
			default:
		}

		this.setState({message: ''})
	}

	dismissAlert({id}) {
		this.setState({alerts : this.state.alerts.slice().filter(alert => alert.id !== id)})
	}

	onDollarClick({id, position}) {
		window.socket.emit('set-position', position)
		window.socket.emit('cash-grab', id)
	}

	render() {
		return (
			<div className="app-container">
			{this.state.player.name ? 
				<Room
					player={this.state.player}
					players={this.state.players}
					message={this.state.message}
					messages={this.state.messages}

					setPlayerPosition={this.setPlayerPosition}
					setMessage={this.setMessage}
					// setPlayerName={this.setPlayerName}

					onEnterMessage={this.onEnterMessage}
					cash={this.state.cash}
					onDollarClick={this.onDollarClick}
				/>
				:
				<LoginForm
					sendPlayerName={this.sendPlayerName}	
				/>


			}
			<Alerts alerts={this.state.alerts} dismissAlert={this.dismissAlert} />

			</div>
		)
	}
}