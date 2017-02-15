import React, { Component } from 'react'
import DocumentMeta from 'react-document-meta';
import shortid from 'shortid'

import TextInput from './TextInput/TextInput'
import Room from './Room/Room'
import LoginForm from './LoginForm/LoginForm'
import Alerts from './Alerts/Alerts'

import {socket, alerts, players, messages, cash} from './sockets'

export default class App extends Component {
	constructor(props) {
		super();

		super(props);
		this.meta = {
			title: 'Socketer Game - Power of socket.io',
			description: 'Game built with socket.io, react, node, express.'
		}
		

		this.state = {
			message: '',
			messages: [],
			player: {},
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

		//== ALERTS SOCKETS
		alerts.on('alert', alert => {
			let alerts = this.state.alerts.slice()
			let _alert = Object.assign({}, alert, 
				{
					id: shortid.generate(),
					cooldown: alert.cooldown || 2500
				})
			alerts.push(_alert)
			this.setState({alerts})

			this.fadeAlert(_alert)
		})

	

		//== ALL PLAYERS SOCKETS
		players.on('update', player => {
			let _players = this.state.players.slice()

			if(_players.find(_player => _player.id === player.id)) {
				_players = _players.map(_player => {
					return (_player.id === player.id) ? Object.assign({}, _player, player) : _player
				})
			} else {
				_players.push(player)
			}

			this.setState({players: _players})

		})

		players.on('left', id => {
			this.setState({
				players: this.state.players.filter(_player => _player.id !== id)
			})
		})

		//== CASH SOCKETS ==//
		cash.on('new', dollar => {
			let _cash = this.state.cash.slice()
			_cash.push(dollar)
			this.setState({cash: _cash})
		})

		cash.on('taken', ({id}) => {
			this.setState({cash: this.state.cash.filter(_dollar => _dollar.id !== id)})
		})

		cash.on('all', cash => {
			this.setState({cash})
		})

		//== PRIVATE SOCKETS ==/
		socket.on('player-update', attrs => {
			this.setState({
				player: Object.assign({}, this.state.player, attrs)
			})
		})

		socket.on('message', ({id, message, playerId}) => {
			let messages = this.state.messages.slice()
			messages.push({
				id,
				content: message,
				position: this.state.players.find(player => player.id === playerId).position
			})
			this.setState({messages})
			this.fadeMessage({id, cooldown: 2000})
		})

		socket.on('alert', alert => {
			let _alert = Object.assign({}, alert, {id: shortid.generate()})

			let alerts = this.state.alerts.slice()
			alerts.push(_alert)

			this.setState({alerts})

			if(alert.cooldown) {
				this.fadeAlert(_alert)
			}
		})



	}

	// Fade message or alert after time
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

	dismissAlert({id}) {
		this.setState({alerts : this.state.alerts.slice().filter(alert => alert.id !== id)})
	}


	// State setters
	setPlayerType(type) {
		this.setState({
			player: Object.assign({}, this.state.player, {type})
		})

		socket.emit('set-type', type)
	}

	setPlayerPosition(position) {
		socket.emit('set-position', position);
	}

	setMessage(message) {
		this.setState({message})
	}

	sendPlayerName(name) {
		socket.emit('set-name', name)
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
		socket.emit('message', this.state.message)
		this.setState({ message: '' })
	}



	runCommand([command, ...params]) {
		socket.emit('command', {command, params})

		this.setState({message: ''})
	}


	onDollarClick({id}) {
		socket.emit('cash-grab', id)
	}

	render() {
		
		return (
			<div className="app-container">
			<DocumentMeta {...this.meta}/>
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