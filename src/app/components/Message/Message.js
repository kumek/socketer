import React from 'react'

const Message = ({id, content, position}) => {
	return (
		<div className="message"
			style={
				{
					top: position.y,
					left: position.x + 50
				}
			}>
		{content}
		</div>
	)
}

export default Message