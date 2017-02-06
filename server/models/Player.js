let shortid = require('shortid')
const PROPS = require('../properties')

class Player {
	constructor({socket, playersSocket}) {
		this.socket = socket
		this.playersSocket = playersSocket

		this._attributes = {
			id: shortid.generate(),
			account: 0,

			hp: PROPS.HP_DEFAULT_VALUE,
			maxHP: PROPS.HP_DEFAULT_VALUE,

			energy: PROPS.ENERGY_DEFAULT_VALUE,
			maxEnergy: PROPS.ENERGY_DEFAULT_VALUE,

			position: PROPS.STARTING_POSITION,
			
			type: PROPS.CHARACTER_TYPES[Math.floor(Math.random() * PROPS.CHARACTER_TYPES.length)]
		}

		this.alert = this.alert.bind(this)
		this.hasEnergy = this.hasEnergy.bind(this)
		this.privateUpdate = this.privateUpdate.bind(this)
		this.publicUpdate = this.publicUpdate.bind(this)

		// Emit id after initialization
		this.privateUpdate()

		// this.publicUpdate()
	}

	get attributes() { return this._attributes }
	set attributes(attrs) {
		Object.assign(this._attributes, attrs) 

		// Emit update after eny change in attributes
		//TODO Make so i.e. energy will not be emited public
		this.privateUpdate(attrs)
		this.publicUpdate(attrs)
	}

	set dead(value) { this.attributes = {dead: true } }
	get dead() { return this.attributes.dead}

	set position(position) { this.attributes = {position}}
	get position() { return this.attributes.position }

	get id() { return this.attributes.id }
	get account() { return this.attributes.account }
	get energy() { return this.attributes.energy }
	get name() { return this.attributes.name }
	get type() { return this.attributes.type }

	

	// Additional functions
	reduceEnergy(value) {
		this.attributes = { energy: this.energy - value }
	}
 
	increaseAccount(value) {
		this.attributes = { account: this.account + parseFloat(value) }
	}

	decreaseAccount(value) {
		this.attributes = { account: this.account - parseFloat(value) }
	}

	increaseHP(value) {
		this.attributes = { hp: this.hp + parseInt(value)}
	}

	decreaseHP(value) {
		this.attributes = { hp: this.hp - parseInt(value)}
	}

	hasEnergy(value) {
		return value <= this.energy
	}

	hasMoney(value) {
		return parseFloat(value) <= this.account
	}

	alert(message) {
		this.socket.emit('alert', {
			//TODO: Temporary generate id
			id: shortid.generate(),
			content: message,
			cooldown: PROPS.ALERT_DEFAULT_COOLDOWN
		})
	}

	privateUpdate(attrs) {
		let obj = attrs ? Object.assign({}, attrs, {id: this.id}) : this._attributes
		this.socket.emit('player-update', obj)
	}

	publicUpdate(attrs) {
		let obj = attrs ? Object.assign({}, attrs, {id: this.id}) : this._attributes
		this.playersSocket.emit('update', obj)
	}
}

module.exports = Player