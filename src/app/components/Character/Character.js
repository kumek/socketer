import React, {Component} from 'react'


const Character = ({
	name,
	position,
	type
}) => {
	return (
		<div className="character"
			style={
				{
					position: 'absolute',
					top: position.y,
					left: position.x
				}
			}>
			{name}
		</div>
	)
}

export default Character