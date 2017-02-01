import React from 'react'

const EnergyBar = ({
	energy
}) => {
	console.log(energy.value, energy.max);
	return (
		<div className="energy-bar">
			<div 
				className="energy-bar__progress"
				style={{	
					width: `${(energy.value/energy.max)*100}%`
				}}
			>
			</div>
			<div className="energy-bar__caption">
				{energy.value}/{energy.max}
			</div>
		</div>
		)
}

export default EnergyBar