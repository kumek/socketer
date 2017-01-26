import React, { Component } from 'react'

export default class TextInput extends Component {
	componentDidMount() {
		this.form.addEventListener('submit', e => {
			e.preventDefault()

			this.props.onEnterMessage()
		})

		this.input.addEventListener('input', e => {
			console.log(e.target.value)
			this.props.setMessage(e.target.value)
		})
	}

	render() {
		return (
			<div className="text-input">
				<div className="message-container">
					<form ref={form => this.form = form}>
						<input className="message-container__input" type="text" ref={input => this.input = input} value={this.props.message}/>
						<button className="button button--grey message-container__button" type="submit" placeholder="Type message ...">Send</button>
					</form>
				</div>	
			</div>
			
		)
	}
}