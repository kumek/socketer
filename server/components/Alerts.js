const PROPS = require('../properties')
const shortid = require('shortid')

class Alerts {
	constructor(socket) {
		this.socket = socket

		this.emit = this.emit.bind(this)
	}


	emit(message) {
		this.socket.emit('alert', {
			id: shortid.generate(), //temporary
			content: message,
			cooldown: PROPS.ALERT_DEFAULT_COOLDOWN
		})
	}

	
}

module.exports = Alerts