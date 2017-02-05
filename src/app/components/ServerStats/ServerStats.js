import React from 'react'
import assets from '../../assets'

const ServerStats= ({
	cash,
	players
}) => {
	return (
		<div className="server-stats">
			<div className="server-stats__cash">
				Dollars: {cash ? cash.length : '0'}
			</div>
			<div className="server-stats__players">
				<ul>
					{
						players
						.filter(player => player.name)
						.sort((player1, player2) => player1.account < player2.account)
						.map(player => 
							<li 
								className="server-stats__player" 
								key={player.id}>
							{player.name} <span className="server-stats__player__account">{player.account.toFixed(2)}</span>
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