// just to make testing easier!
import { Router } from '@neriko/cloudflare-workers-router'
const router = new Router();

import { $ } from 'cfw-easy-html'
import { response, cookies, secrets } from './src/index.js'

router.get('/json', async (req) => {
    return response.json({'Hello': 'world!'})
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
    return response.html('<b>Hello, world!</b><p>This is a test of the easy-utils HTML response type.</p>')
})

router.get('/cookies', async (req) => {
    var cookieJar = new cookies.jar(req)

    var token = secrets.uuidv4()

    cookieJar.set('authToken', token)
    cookieJar.set('data', { 'hello': 'world' })

    return response.json({ token, oldToken: cookieJar.get('authToken') }, { cookies: cookieJar })
})

addEventListener('fetch', (event) => {
    if (event.request.method == 'OPTIONS') {
        return event.respondWith(response.cors())
    }

    return event.respondWith(router.handle(event.request))
})