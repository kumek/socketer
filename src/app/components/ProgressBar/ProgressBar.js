import React from 'react'


const ProgressBar = ({
	value,
	max,
	styleClass
}) => {
	return (
		<div 
			className={'progress-bar' + (styleClass ? ` progress-bar--${styleClass}` : '')}
			style={
				{ height: 'height' }
			}>
			<div 
				className="progress-bar__progress"
				style={{	
					width: `${(value/max)*100}%`
				}}
			>
			</div>
			<div className="progress-bar__caption">
				{value}/{max}
			</div>
			
		</div>
	)
}


export const EnergyBar = ({ energy, max }) => { 
	return <ProgressBar 
		value={energy} 
		max={max} 
		styleClass="energy"/>
	}

export const HPBar = ({ hp, max }) => { 
	return <ProgressBar 
		value={hp} 
		max={max} 
		styleClass="hp"/> 
	}
export default ProgressBar