import React from 'react'
import assets from '../../assets'

const Dollar = ({
	dollar,
	onDollarClick
}) => {
	return (
		<div
			className="dollar"
			style={
					{	
						top: dollar.position.y,
						left: dollar.position.x
					}
				}
			onClick={onDollarClick.bind(null, dollar)}
			>
			<img 
				src={`/resources/images/${assets.items.dollar.file}`} 
				alt=""
				
			/>
		</div>
	)
}

export default Dollar