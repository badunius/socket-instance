const cp = require('child_process')

const server = require('net').createServer()

const receive = (evt, sock) => {
	const src = Buffer.from(evt).toString('utf-8').trim()
	const [cmd, arg] = src.split(':')

	switch (cmd) {
		case 'inst': {
			const inst = cp.fork('instance.js')
			inst.on('message', receive)
			inst.send('join', sock)
			return
		}

		case 'leave': {
			sock.on('data', (evt) => receive(evt, sock))
			return
		}

		case 'quit': {
			sock.end('bye')
			sock.destroy(1000)
			return
		}

		default: {
			console.log('>>>', src)
		}
	}
}

const error = (err) => {
	console.log(err)
}

const close = (evt) => {
	console.log('closed', evt)
}

server.on('connection', (socket) => {
	console.log('! connected')
	socket.on('error', error)
	socket.on('close', close)
	socket.on('data', (evt) => receive(evt, socket))
})

server.listen(1492, '0.0.0.0')
console.log('ready')