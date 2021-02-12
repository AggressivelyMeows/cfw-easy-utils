# Cloudflare Workers: Easy Utils
*A library designed to make writing workers so much cleaner and easier!*

This lib is going to a bunch of helpers for making your code easier to read.

## Install
`npm i cfw-easy-utils`

**Bare bones example**

```js
import { response } from 'cfw-easy-utils'

addEventListener("fetch", event => {
    if (event.request.method == 'OPTIONS') {
        // if this is a CORS request, let easy-utils handle the return.
        return event.respondWith(response.cors(event.request))
    }

    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    var data = await fetch('https://drand.cloudflare.com/public/latest').then(resp => resp.json())

    var toSendBack = {
        'hello': 'world',
        'randomData': data.randomness
    }

    // response.json returns a valid response object
    // with all of the required headers set.
    // includes CORS headers.
    return response.json(toSendBack)
}
```

### Response helpers
A bunch of handler functions to solve the bane of any developers work, ***hard-to-read and messy code***. Also auto-magically handles CORS, enabled by default but can be disabled.

**Before**
```js
return new Response(
    JSON.stringify({ 'hello': 'world' }),
    { headers: { 'content-type': 'application/json' } },
)
```

**After**
```js
return response.json({ 'hello': 'world!' })
```
