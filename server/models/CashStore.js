class CashStore {
	constructor({cashSocket}) {
		this.cashSocket = cashSocket
		this._cash = []

		this.findDollar = this.findDollar.bind(this)
		this.takeDollar = this.takeDollar.bind(this)

	}

	set cash(_cash) {
		this._cash = _cash
	}

	get cash() {
		return this._cash
	}

	putDollar(dollar) {
		this._cash.push(dollar)
		this.cashSocket.emit('new', dollar)
		console.log('DOLLARS: '+ `${this._cash.length}`.green)

	}

	takeDollar(dollar) {
		let foundDollar = this.findDollar(dollar.id)
		if(foundDollar) {
			this._cash = this._cash.filter(_dollar => _dollar.id !== foundDollar.id)
			this.cashSocket.emit('taken', foundDollar)
			console.log('DOLLARS: '+ `${this._cash.length}`.red)
			return true
		}

		return false
	}

	findDollar(id) {
		return this._cash.find(_dollar => _dollar.id === id)
	}


}

module.exports = CashStore