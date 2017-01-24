import React, { Component } from 'react'

export default class Map extends Component {
	drawPlayers({players, mapSize}) {
		//Count pixels per one unit
		let ppu = {
			width: window.innerWidth/mapSize.width,
			height: window.innerHeight/mapSize.height
		}

		return players.map(player => {
			return (
				<div 
					className={`player player--${player.class}`}
					style={
						{
							position: 'absolute',
							top: player.position.y * ppu.height,
							left: player.position.x * ppu.width
						}
					}>
					{player.name}
				</div>
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
				{this.drawPlayers({
					players: this.props.players,
					mapSize: {
						width: 1000,
						height: 1000
					}
				})}
			</div>	
		)
		
	}
}