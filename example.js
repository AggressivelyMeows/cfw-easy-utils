import { response } from './src/index.js'

addEventListener('fetch', (event) => {
    if (event.request.method == 'OPTIONS') {
        return event.respondWith(response.cors())
    }

    return event.respondWith(router.handle(event.request))
})