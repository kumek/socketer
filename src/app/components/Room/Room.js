import React, {Component} from 'react'
import TextInput from '../TextInput/TextInput'
import CharactersMap from '../CharactersMap/CharactersMap'

const Room = ({
	players,
	message,
	messages,
	setPlayerPosition,
	setMessage,
	onEnterMessage
}) => {
	return (
		<div>
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



