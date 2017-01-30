import React from 'react'
import assets from '../../assets'

const ServerStats= ({
	cash,
	players
}) => {
	return (
		<div className="server-stats">
			<div className="server-stats__cash">
				Dollars: {cash.length}
			</div>
			<div className="server-stats__players">
				<ul>
					{
						players.map(player => 
							<li 
								className="server-stats__player" 
								key={player.id}>
							{player.name}
							<img
								className="server-stats__player__logo"
								src={`/resources/images/${assets.characters.find(asset => asset.name === player.type).file}`} 
								alt=""/>
							</li>)
					}
				</ul>
			</div>
		</div>
		)

}

export default ServerStats