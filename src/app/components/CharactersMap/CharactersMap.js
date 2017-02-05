import React, { Component } from 'react'
import Character from '../Character/Character'
import Message from '../Message/Message'

export default class CharactersMap extends Component {
	drawPlayers(players) {
		//Count pixels per one unit
		console.log('drawingPlayers')
		return players
			.sort((p1, p2) => {
				return p1.position.y >  p2.position.y
			})
			.map(player => {
			return (
				<Character 
					key={player.id}
					name={player.name}
					position={player.position}
					type={player.type}
					dead={player.dead}
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
			this.props.setPlayerPosition({x: e.clientX, y: e.clientY})
		})
	}

	render() {
		return (
			<div className="map" ref={map => this.map = map} style={{ position: 'relative' }}>
				<div style={{padding: '20px'}}>
					Commands:
					<p>
						/character [name] (butter,kenny,eric,kevin,kyle,stan,tweek,wendy) - 10E<br/>
						/backstab (Standing behind somebody) - 65E<br/>
						/generate [number] (max=50) - 25E <br/>
						/give [player] [cash] <br/>
						/revive (After being backstabbed) - $1250, 50E <br/>
					</p>
				</div>
				{this.drawPlayers(this.props.players)}
				{this.drawMessages({messages: this.props.messages})}
			</div>	
		)
		
	}
}