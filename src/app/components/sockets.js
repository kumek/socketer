
// Local configuration
export const socket = window.io.connect('http://localhost:4666')
export const alerts = window.io.connect('http://localhost:4666/alerts')
export const players = window.io.connect('http://localhost:4666/players')
export const messages = window.io.connect('http://localhost:4666/messages')
export const cash = window.io.connect('http://localhost:4666/cash')



// Server configuration
// export const socket = window.io.connect()
// export const alerts = window.io.connect('/alerts')
// export const players = window.io.connect('/players')
// export const messages = window.io.connect('/messages')
// export const cash = window.io.connect('/messages')

