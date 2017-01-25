import React, {Component} from 'react'
export default class LoginForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			name: ''
		}
	}

	componentDidMount(component) {
		this.form.addEventListener('submit', e => {
			e.preventDefault()
			this.props.sendPlayerName(this.state.name)
		})

		this.input.addEventListener('input', e => {
			this.setState({ name: e.target.value })
		})
	}

	render() {
		return (
			<div className="login-form">
				<form ref={form => this.form = form}>
					<h2 className="login-form__title">
						Type your name
					</h2>
					<div className="login-form__input">
						<input ref={input => this.input = input} type="text" value={this.state.name}/>
						<button className="button button--grey" type="submit" >Join</button>
					</div>	
				</form>
			</div>
		)
	}
}