import React, { Component } from 'react'
import Character from '../Character/Character'
import Message from '../Message/Message'

export default class Map extends Component {
	drawPlayers({players, mapSize}) {
		//Count pixels per one unit
		return players.map(player => {
			return (
				<Character 
					name={player.name}
					position={player.position}
					type={player.type}
				/>
			)
		})
	}

	drawMessages({messages}) {
		return messages.map(({id, content, position}) => {
			return (
				<Message 
					id={id}
					content={content}
					position={position}
				/>
			)
		})
	}

	componentDidMount() {
		this.map.addEventListener('click', e => {
			this.props.setPlayerPosition({x: e.clientX-50, y: e.clientY-100})
		})
	}

	render() {
		return (
			<div className="map" ref={map => this.map = map} style={{ position: 'relative' }}>
				<div style={{padding: '20px'}}>
					Commands:
					<p>
						/character [name] (butter,kenny,eric,kevin,kyle,stan,tweek,wendy)		
					</p>
				</div>
				{this.drawPlayers({ players: this.props.players })}
				{this.drawMessages({messages: this.props.messages})}
			</div>	
		)
		
	}
}