import React, { Component } from 'react'
import TextInput from './TextInput/TextInput'
import Map from './Map/Map'

export default class App extends Component {
	constructor(props) {
		super();
		this.socket = window.io('');

		super(props);

		this.state = {
			message: '',
			players: [
				{
					id: 125,
					position: {
						x: 340,
						y: 560
					},
					name: 'Superman',
					class: 'red'
				}
			],
			playerId: 125
		}
	}

	setPlayerPosition({x, y}) {

	}

	sendMessage() {

	}



	render() {
		return (
			<div>
				<Map 
					players={this.state.players}
					setPlayerPosition={this.setPlayerPosition}
				/>
				<TextInput 
					sendMessage={this.sendMessage}
					setMessage={message => {this.setState({ message })}}
				/>
			</div>
		)
	}
}