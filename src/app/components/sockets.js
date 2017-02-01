
// Local configuration
export const socket = window.io.connect('http://localhost:4666')
export const alerts = window.io.connect('http://localhost:4666/alerts')

// Server configurationf
// export const socket = window.io.connect()
// export const alerts = window.io.connect('/alerts')

