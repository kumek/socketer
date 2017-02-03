import React, {Component} from 'react'
import assets from '../../assets'

const Character = ({
	name,
	position,
	type,
	dead
}) => {
	let asset = assets.characters.find(char => char.name === (dead ? 'dead' : type || 'eric'))

	return (
		<div className="character"
			style={
				{
					position: 'absolute',
					top: (position ? position.y : 400) - 100,
					left: (position ? position.x : 340) - 50
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