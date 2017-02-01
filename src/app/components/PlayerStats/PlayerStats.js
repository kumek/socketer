import React from 'react'
import EnergyBar from '../EnergyBar/EnergyBar'

const PlayerStats = ({
	player
}) => {
	return (
		<div className="player-stats">
			<EnergyBar energy={player.energy} />
			<div className="palyer-stats__account">
				Cash: {player.account.toFixed(2)}
			</div>
		</div>
		)
}
export default PlayerStats