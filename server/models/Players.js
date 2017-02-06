class Players {
	constructor() {
		this._players = []
	}

	get all() { return this._players }

	find(player) {
		return this._players.find(({id}) => player.id === id)
	}

	push(player) {
		this._players.push(player)
	}

	remove(player) {
		this._players = this._players.filter(({id}) => player.id !== id)
	}
}

module.exports = Players