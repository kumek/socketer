const PROPS = require('../properties')

const distance = (p1, p2) => {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}


module.exports = ({io, playersSocket, alerts}) => {
	return {
		grabCash: ({player, cashStore}) => (id) => {
			let dollarFound = cashStore.findDollar(id)

			if(!dollarFound) {
				player.alert('You missed!')
				return
			}

			if(distance(dollarFound.position, player.position) > PROPS.DOLLAR_GRAB_DISTANCE) {
				player.alert('Step closer')
				return
			}

			//==ALL PASSED
			cashStore.takeDollar(dollarFound)
			player.increaseAccount(dollarFound.value)
		}
	}
}