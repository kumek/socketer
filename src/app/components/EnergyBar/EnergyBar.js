import React from 'react'

const EnergyBar = ({
	energy,
	max
}) => {
	// console.log(energy, max);
	return (
		<div className="energy-bar">
			<div 
				className="energy-bar__progress"
				style={{	
					width: `${(energy/max)*100}%`
				}}
			>
			</div>
			<div className="energy-bar__caption">
				{energy}/{max}
			</div>
		</div>
		)
}

export default EnergyBar