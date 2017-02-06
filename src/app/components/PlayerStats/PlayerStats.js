import React from 'react'
import {EnergyBar, HPBar} from '../ProgressBar/ProgressBar'

const PlayerStats = ({
	player
}) => {
	return (
		<div className="player-stats">
			<HPBar hp={player.hp} max={player.maxHP}/>
			<EnergyBar energy={player.energy} max={player.maxEnergy} />
			<div className="palyer-stats__account">
				Cash: {player.account.toFixed(2)}
			</div>
		</div>
		)
}
export default PlayerStats