import React from 'react'
import Dollar from '../Dollar/Dollar'

const Items = ({
	cash,
	onDollarClick
}) => {
	return (
		<div className="items">
			{cash.map(dollar => <Dollar key={dollar.id} dollar={dollar} onDollarClick={onDollarClick}/>)}
		</div>
	)
}

export default Items