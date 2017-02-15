import React, {Component} from 'react'
import DocumentMeta from 'react-document-meta'

import TextInput from '../TextInput/TextInput'
import CharactersMap from '../CharactersMap/CharactersMap'
import Items from '../Items/Items'
import PlayerStats from '../PlayerStats/PlayerStats'
import ServerStats from '../ServerStats/ServerStats'

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
			<DocumentMeta {...{title: `Socketer - ${player.name}`}}/>

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
			<div className="stats">
				<PlayerStats
					player={player}
				/>
				<ServerStats
					cash={cash}
					players={players}
				/>
			</div>
			
		</div>
	)
}

export default Room



