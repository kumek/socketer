import React, {Component} from 'react'
import TextInput from '../TextInput/TextInput'
import CharactersMap from '../CharactersMap/CharactersMap'
import Items from '../Items/Items'

const Room = ({
	players,
	message,
	messages,
	cash,
	setPlayerPosition,
	setMessage,
	onEnterMessage
}) => {
	return (
		<div>
			<Items 
				cash={cash}
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
		</div>
	)
}

export default Room



