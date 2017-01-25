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
			<img className="character__logo" src="resources/images/butter.png" alt=""/>
			<div className="character__name">
				{name}
			</div>
		</div>
	)
}

export default Character