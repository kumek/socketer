import React, {Component} from 'react'
import assets from '../../assets'

const Character = ({
	name,
	position,
	type,
	dead
}) => {
	let asset = assets.characters.find(char => char.name === (dead ? 'dead' : type))

	return (
		<div className="character"
			style={
				{
					position: 'absolute',
					top: position.y,
					left: position.x
				}
			}>
			<img className="character__logo" src={`resources/images/${asset ? asset.file : 'butter.png'}`} alt="" style={dead ? {height: '100px'} : null}/>
			<div className="character__name">
				{name}
			</div>
		</div>
	)
}

export default Character