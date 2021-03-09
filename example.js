import { $ } from 'cfw-easy-html'
import { Router } from '@neriko/cloudflare-workers-router'
import { response, cookies, secrets, Stopwatch, WebsocketResponse, Websocket } from './src/index.js'

global.Websocket = Websocket

import { io } from "socket.io-client"

const d3 = require('d3-scale-chromatic')

const router = new Router()

router.get('/json', async (req) => {
    return response.json({ 'Hello': 'world!' })
})

router.get('/colour/:type/:value', async (req, params) => {
    var c = d3[params.type](params.value).replace('rgb(', '').replace(')', '')
    return response.json({ r: parseInt(c.split(',')[0].trim()), g: parseInt(c.split(',')[1].trim()), b: parseInt(c.split(',')[2].trim()) })
})

router.get('/ws', async (req, params) => {
    var resp = new WebsocketResponse()
    // Logger is an internal logging util such as an output Websocket.
    const socket = io("wss://socketio-chat-h9jt.herokuapp.com/socket.io", {
        reconnectionDelayMax: 10000,
        transports: ['websocket'],
        upgrade: false
    })

    socket.on("connect", (_socket) => {
        resp.send("Client connected to server: " + clientName)
        resp.send("Transport being used: " + socket.io.engine.transport.name)
    });

    resp.on('message', (msg) => {
        ws.send(msg)
    })

    console.log(socket)

    

    return response.websocket(resp)
})

router.get('/cdn/:path', async (req, params) => {
    // Serve content from a static host, in this example, my personal DigitalOcean S3-like host.
    // Because the route starts with /cdn, I want to remove that prefix from the asset location
    // otherwise it will try to find /cdn/static/2021/01/test.png which is 404.
    console.log('woof')
    return response.static(req, {
        baseUrl: 'https://cerulean.nyc3.digitaloceanspaces.com',
        routePrefix: '/cdn'
    })
})

router.get('/json/:message', async (req, params) => {
    // if we want our CORS headers to be origin-aware, we need to provide the response object with our original request.
    response.request = req

    return response.json(
        {'message': params.message},
        {
            headers: {
                'x-hello': 'world'
            },
            status: 200 // anything over 500, CF will return the standard HTML error message.
        }
    )
})

router.get('/html', async (req) => {
    // An example HTML response
    return response.html('<b>Hello, world!</b><p>This is a test of the easy-utils HTML response type.</p>')
})

router.get('/cookies', async (req) => {
    // Example on how to use Cookies with CookieJar
    var cookieJar = new cookies.jar(req)

    var token = secrets.uuidv4()

    cookieJar.set('authToken', token)
    cookieJar.set('data', { 'hello': 'world' })

    return response.json({ token, oldToken: cookieJar.get('authToken') }, { cookies: cookieJar })
})

router.get('/hash', async (req) => {
    // A password hash generation service example
    var password = new URL(req.url).searchParams.get('password') || 'heck'

    var pass = await secrets.hashPassword(password)

    var match = await secrets.validatePassword(password, pass)

    return response.json({ password: pass, isValid: match })
})

addEventListener('fetch', (event) => {
    if (event.request.method == 'OPTIONS') {
        return event.respondWith(response.cors())
    }

    return event.respondWith(router.handle(event.request))
})