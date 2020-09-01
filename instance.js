// socket message
const instHandler = (evt, sock) => {
	const src = Buffer.from(evt).toString('utf-8').trim()
	const [cmd, arg] = src.split(':')
	console.log('Inst Handler', src)
	switch(cmd) {
		case 'leave': {
			console.log('leaving')
			process.send('leave', sock)
			return
		}

		default: {
			console.log([cmd, arg])
			return
		}
	}
}

// message from parent process
const main = (msg, data) => {
	switch (msg) {
		case 'join': {
			console.log('joined')
			data.on('data', (evt) => instHandler(evt, data))
			return
		}
		default: {
			console.log('inst msg > ', msg)
			return
		}
	}
}

process.on('message', main)