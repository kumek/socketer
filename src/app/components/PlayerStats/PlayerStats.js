import React from 'react'

const PlayerStats = ({
	player
}) => {
	return (
		<div className="player-stats">
			<div className="palyer-stats__account">
				Cash: {player.account}
			</div>
		</div>
		)
}
export default PlayerStats