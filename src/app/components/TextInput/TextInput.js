import React, { Component } from 'react'

export default class TextInput extends Component {
	componentDidMount() {
		this.form.addEventListener('submit', e => {
			e.preventDefault()

			this.props.sendMessage()
		})

		this.input.addEventListener('input', e => {
			this.props.setMessage(e.target.value)
		})
	}

	render() {
		return (
			<div className="text-input">
				<div className="message-container">
					<form ref={form => this.form = form}>
						<input className="message-container__input" type="text" ref={input => this.input = input}/>
						<input className="message-container__button" type="submit" placeholder="Type message ..."/>
					</form>
				</div>	
			</div>
			
		)
	}
}