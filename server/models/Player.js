let shortid = require('shortid')
const PROPS = require('../properties')

class Player {
	constructor(params) {
		this.id = shortid.generate()

		Object.assign(this, params)

		this.alert = this.alert.bind(this)
		this.hasEnergy = this.hasEnergy.bind(this)
	}

	hasEnergy(value) {
		return value >= this.energy.value
	}

	alert(message) {
		this.socket.emit('alert', {
			content: message,
			cooldown: PROPS.ALERT_DEFAULT_COOLDOWN
		})
	}
}

module.exports = Player