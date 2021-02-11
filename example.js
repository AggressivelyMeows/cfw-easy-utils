// just to make testing easier!
import { Router } from '@neriko/cloudflare-workers-router'
const router = new Router();

import { response } from './src/index.js'

router.get('/json', async (req) => {
    return response.json({'Hello': 'world!'})
})

router.get('/json/:message', async (req, params) => {
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

addEventListener('fetch', (event) => {
    if (event.request.method == 'OPTIONS') {
        return event.respondWith(response.cors())
    }

    return event.respondWith(router.handle(event.request));
})