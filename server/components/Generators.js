const PROPS = require('../properties')
const shortid = require('shortid')

exports.GENERATE_DOLLAR = ({cashStore}) => () => {
		if(cashStore.cash.length < PROPS.DOLLAR_MAX_NUMBER_ON_MAP) {
			let dollar = {
				id: shortid.generate(),
				value: (Math.random() * (PROPS.DOLLAR_MAX_VALUE-PROPS.DOLLAR_MIN_VALUE)) + PROPS.DOLLAR_MIN_VALUE,
				position: {
					x: Math.floor(Math.random()*900)-50,
					y: Math.floor(Math.random()*900)-50
				}
			}
			cashStore.putDollar(dollar)
		}
	}

exports.RESTORE_ENERGY = ({players}) => () => players.all.forEach(player => {
	if(player.energy < player.attributes.maxEnergy) {
		player.increaseEnergy(player.attributes.restoreEnergy)	
	}
})

exports.RESTORE_HP = ({players}) => () => players.all.forEach(player => {
	if(player.hp < player.attributes.maxHP) {
		player.increaseHP(player.attributes.restoreHP)
	}
})


class Generators {
	constructor(data) {
		this.generators = []
		this.data = data
	}

	startInterval(generator, interval) {
		const genId = setInterval(generator(this.data), interval)
		this.generators.push(genId)
		return genId
	}

	stopInterval(_id) {
		clearInterval(id)
		this.generators = this.generators.filter(id => id !== id)
	}

	runOnce(generator) {
		generator(this.data)()
	}

	stopAll() {
		this.generators.forEach(id => clearInterval(id))
	}
}

exports.Generators = Generators