import { response, WebsocketResponse} from './src/index.js'

addEventListener('fetch', (event) => {
    var server = new WebsocketResponse()

    server.on('message', msg => {
        server.send({ got: msg })
    })

    event.respondWith(new Promise(r => r(response.websocket(server))))
})