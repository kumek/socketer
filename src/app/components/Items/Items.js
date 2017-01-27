import React from 'react'
import Dollar from '../Dollar/Dollar'

const Items = ({
	cash
}) => {
	console.log("Itemsf saldifjas lifj asldfijaslidfjls")
	return (
		<div className="items">
			{cash.map(dollar => <Dollar key={dollar.id} dollar={dollar}/>)}
		</div>
	)
}

export default Items