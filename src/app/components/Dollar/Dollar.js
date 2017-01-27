import React from 'react'
import assets from '../../assets'

const Dollar = ({
	dollar,
}) => {
	console.log('DOllar is sgdalsigdjlasiegjlsaiegjlsge ')
	return (
		<div
			className="dollar"
			style={
					{	
						top: dollar.position.y,
						left: dollar.position.x
					}
				}
			>
			<img 
				src={`/resources/images/${assets.items.dollar.file}`} 
				alt=""
				
			/>
		</div>
	)
}

export default Dollar