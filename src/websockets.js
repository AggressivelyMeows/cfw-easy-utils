import { createNanoEvents } from "nanoevents"

export class Websocket {
    constructor (url, options) {
        this.url = url
        this.options = options
        this.emitter = createNanoEvents()
        this.sendQueue = []

        if (this.url.includes('wss:')) {
            this.url = this.url.replace('wss:', 'https:')
        }

        if (this.url.includes('ws:')) {
            this.url = this.url.replace('ws:', 'http:')
        }

        this.connect()
    }

    log(msg) {
        if (this.options.logger) {this.options.logger.send(msg)}
    }

    async connect() {
        // Undocumented API at time of writing.
        var resp = await fetch(this.url, { headers: {'upgrade': 'websocket'} })
        this.socket = resp.webSocket
        this.socket.accept()

        this.socket.addEventListener('message', (msg) => {
            this.emitter.emit('rawmessage', msg)

            var data = msg.data
            try {
                data = JSON.parse(data)
                if (typeof data == 'string') {
                    // JSON convert returned a String, that means the original was a string.
                    // we want to return the original frame as we dont want to add extra quotes to the string.
                    data = msg.data
                }
            } catch (e) {
                // ignore parser errors
            } 

            this.emitter.emit('message', data)
        })

        this.socket.addEventListener('close', () => {
            this.emitter.emit('close')
        })

        this.sendQueue.forEach(queued => {
            this.socket.send(queued)
        })

        this.sendQueue = []
    }

    on(event, callback) {
        return this.emitter.on(event, callback)
    }

    addEventListener(event, callback) {
        if (event == 'message') {
            event = 'rawmessage'
        }
        return this.emitter.on(event, callback)
    }

    send(data, options) {
        var toSend = data

        if (data.constructor == Object || data.constructor == Array) {
            toSend = JSON.stringify(toSend)
        }
        
        if (!this.socket) {
            this.sendQueue.push(toSend)
        } else {
            this.socket.send(toSend)
        }
    }
}

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