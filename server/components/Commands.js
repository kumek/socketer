const PROPS = require('../properties')

const BACKSTAB = 'backstab'
const GENERATE = 'generate'
const CHARACTER = 'character'
const REVIVE = 'revive'
const GIVE = 'give'


const backstabCommand = (params, {player, players, alerts}) => {
	if(!player.hasEnergy(PROPS.ENERGY_COST_BACKSTAB)) {
		player.alert('Not enough energy')
		return
	}

	let deathPlayer = players.find(({id, name, position, dead}) => {
		return (id !== player.id ) && (!dead) &&
		(Math.abs(position.x - player.position.x) < 45) &&
		(position.y - player.position.y < 30) &&
		(position.y - player.position.y > 0)
	})

	if(deathPlayer) {
		alerts.emit(`${deathPlayer.name} is dead!`)

		deathPlayer.dead = true
	} else {
		player.alert("You didn't hit")
	}

	player.reduceEnergy(PROPS.ENERGY_COST_BACKSTAB);
}


const generateCommand = (params, {player, alerts, generateDollars}) => {

	if(!player.hasEnergy(PROPS.ENERGY_COST_GENERATE_DOLLARS)) {
		player.alert("Not enough energy")
		return		
	}

	//== ALL PASSED
	generateDollars(params[0])
	player.reduceEnergy(PROPS.ENERGY_COST_GENERATE_DOLLARS)
	alerts.emit(`${player.name} generated ${params[0]} dollars`)
}

const characterCommand = (params, {player}) => {

	if(!PROPS.CHARACTER_TYPES.find(character => character === params[0])) {
		player.alert(`No such character "${params[0]}`)
		return
	}

	if(!player.hasEnergy(PROPS.ENERGY_COST_CHARACTER)) {
		player.alert("Not enough energy")
		return
	}

	//== ALL PASSED
	console.log(`[${player.id}]`.yellow + ` Set type: ` + `${params[0]}`.green)
	player.reduceEnergy(PROPS.ENERGY_COST_CHARACTER)
	player.attributes = {type: params[0]}
}

const reviveCommand = (params, {player}) => {
	if(!player.dead) {
		player.alert('You are not dead!')
		return
	}

	if(!player.hasEnergy(PROPS.ENERGY_COST_REVIVE)) {
		player.alert("Not enough energy")
		return
	}

	if(!player.hasMoney(PROPS.MONEY_COST_REVIVE)) {
		player.alert(`You need $${PROPS.MONEY_COST_REVIVE}`)
		return
	}

	//== ALL PASSED
	player.dead = false
	player.reduceEnergy(PROPS.ENERGY_COST_REVIVE)
	player.decreaseAccount(PROPS.MONEY_COST_REVIVE)
}

const giveCommand = (params, {player, players}) => {
	let foundPlayer = players.find(_player => _player.name && _player.name.toLowerCase() === params[0].toLowerCase())
	if(!foundPlayer) {
		player.alert(`No such player "${params[0]}`)
		return
	}

	if(!player.hasMoney(params[1])) {
		player.alert(`You dont have $${params[1]}`)
		return
	}

	//== ALL PASSED
	player.decreaseAccount(params[1])
	foundPlayer.increaseAccount(params[1])
	foundPlayer.alert(`You have received $${params[1]} from ${player.name}`)
}

exports.execute = ({command, params}, data) => {
	switch(command.toLowerCase()) {
		case BACKSTAB:
			backstabCommand(params, data)
			break

		case GENERATE: 
			generateCommand(params, data)
			break

		case CHARACTER:
			characterCommand(params, data)
			break

		case REVIVE:
			reviveCommand(params, data)
			break

		case GIVE:
			giveCommand(params, data)
			break

		default:
			data.player.alert(`No command: "${command}"`) 
	}

}
