import React, {Component} from 'react'
import TextInput from '../TextInput/TextInput'
import CharactersMap from '../CharactersMap/CharactersMap'
import Items from '../Items/Items'
import PlayerStats from '../PlayerStats/PlayerStats'

const Room = ({
	player,
	players,
	message,
	messages,
	cash,
	setPlayerPosition,
	setMessage,
	onEnterMessage,
	onDollarClick
}) => {
	return (
		<div>
			<Items 
				cash={cash}
				onDollarClick={onDollarClick}
			/>
			<CharactersMap 
				players={players}
				messages={messages}
				setPlayerPosition={setPlayerPosition}
			/>

			<TextInput
				message={message}
				setMessage={setMessage}
				onEnterMessage={onEnterMessage}
			/>
			<PlayerStats
				player={player}
			/>
		</div>
	)
}

export default Room



