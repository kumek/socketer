import React, { Component } from 'react'
import TextInput from './TextInput/TextInput'
// import Map from './Map/Map'
import Room from './Room/Room'
import LoginForm from './LoginForm/LoginForm'

export default class App extends Component {
	constructor(props) {
		super();

		console.log('app.js constructor run')

		super(props);

		this.state = {
			message: '',
			messages: [],
			player: {},
			players: [],
		}

		// Binding
		this.setMessage = this.setMessage.bind(this)
		this.sendMessage = this.sendMessage.bind(this)
		this.sendPlayerName = this.sendPlayerName.bind(this)
		this.setPlayerPosition = this.setPlayerPosition.bind(this)
		this.fadeMessage = this.fadeMessage.bind(this)

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

		window.socket.on('players', players => {
			this.setState({players})
		})

		window.socket.on('your-id', (id) => {
			console.log(`You received your id: ${id}`)
			this.setState({
				player: Object.assign({}, this.state.player, {id})
			})
		})

		window.socket.on('player-position', ({playerId, position}) => {
			console.log(`Player ${playerId} moved to ${position.x},${position.y}`)
			let players = this.state.players.slice().map(player => {
				return (playerId === player.id ? Object.assign({}, player, {position}) : player)
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
	}

	fadeMessage({id, cooldown}) {
		console.log(id)
		console.log(cooldown)
		setTimeout(() => {
			console.log('Messages before fade')
			console.log(this.state.messagse)
			let messages = this.state.messages.filter(message => message.id !== id)
			console.log(messages)
			this.setState({messages})
		}, cooldown)
	}

	// State setters
	setPlayerName(name) {
		this.setState({
			player: Object.assign({}, this.state.player, { name })
		})
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
		this.setState({
			player: Object.assign({}, this.state.player, { name })
		})
		window.socket.emit('set-username', name)
	}

	sendMessage() {
		console.log('Sending message')
		window.socket.emit('message', this.state.message)
		this.setState({ message: '' })
	}


	render() {
		return (
			<div className="app-container">
			{this.state.player.name ? 
				<Room
					players={this.state.players}
					message={this.state.message}
					messages={this.state.messages}

					setPlayerPosition={this.setPlayerPosition}
					setMessage={this.setMessage}
					// setPlayerName={this.setPlayerName}

					sendMessage={this.sendMessage}
				/>
				:
				<LoginForm
					sendPlayerName={this.sendPlayerName}	
				/>

			}
			</div>
		)
	}
}