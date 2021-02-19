import { createNanoEvents } from "nanoevents"

export class WebsocketResponse {
    constructor () {
        let pair = new WebSocketPair()
        this.socket = pair[1]
        this.client = pair[0]

        // accept our end of the socket
        this.socket.accept()

        this.emitter = createNanoEvents()

        this.session = {
            history: [],
            startTime: new Date(),
            lastMessageTime: null,
        }

        this.socket.addEventListener('message', (msg) => {
            var data = msg.data

            try {
                data = JSON.stringify(data)

                if (typeof data == 'string') {
                    // dont JSON wrap data that is already a string.
                    data = msg.data
                }
            } catch (e) {
                // couldn't parse incoming data
            }

            this.session.lastMessageTime = new Date()

            this.emitter.emit('message', data)
        })

        this.socket.addEventListener('close', () => this.emitter.emit('close'))
    }

    on(event, callback) {
        return this.emitter.on(event, callback)
    }

    send(data, options) {
        var toSend = data

        if (data.constructor == Object || data.constructor == Array) {
            toSend = JSON.stringify(toSend)
        }

        this.socket.send(toSend)
    }
}