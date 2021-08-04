// require your server and launch it
const server = require('./api/server')

const port = 1000

server.listen(port, () => {
    console.log(`currently listening on ${port}`)
})