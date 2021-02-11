# Cloudflare Workers: Easy Utils
*A library designed to make writing workers so much cleaner and easier!*

This lib is going to a bunch of helpers for making your code easier to read.

## Install
`npm i cfw-easy-utils`

```js
import { response } from 'cfw-easy-utils'

addEventListener('fetch', async (event) => {
    if (event.request.method == 'OPTIONS') {
        return event.respondWith(response.cors())
    }

    return event.respondWith(new Promise(async res => {
        // respondWith needs a promise.
        var data = await fetch('https://drand.cloudflare.com/public/latest').then(resp => resp.json())

        var toSendBack = {
            'hello': 'world',
            'randomData': data.randomness
        }

        // resolve promise with a response.
        res(response.json(toSendBack)))
    })

})
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

---
### OptionsObject
An object describing what extras to modify the response with. Almost all of the response functions accept this as the second argument except where stated.

#### headers, default: `{}`
An object for setting the response headers. Case sensitive so watch out!

### status, default: `200`
The status of the response.

#### autoCors, default: `true`
Adds standard CORS headers to the response so you don't have to deal with CORS errors. To set the default values, set the values on the response module you imported:

```js
import { response } from 'cfw-easy-utils'
response.accessControl.allowOrigin = 'https://example.com'
```

**Full example**
```js
{
    headers: { 'Location': 'https://example.com' }, // default: {}
    status: 301, // default: 200
    autoCors: false, // default: true
}
```

### response.json(body: StringOrObject, options: OptionsObject)
Returns a response object ready to be returned to the client with correct headers set.
**Accepts a JSON string OR a standard JS object.**

```js
return response.json({ 'hello': 'world' })
```

### response.html/.text(body: String, options: OptionsObject)
Helper function to handle specific types of content to return. `response.html` and `response.text` do effectively the same thing but they have different `Content-Type` headers.

```js
return response.html('<p>hello, world!</p>')
```

### response.cors()
Returns `null` but with CORS headers set as if it were an `OPTIONS` request.
You might be interested in this snippet for handling CORS requests:

```js
addEventListener('fetch', (event) => {
    if (event.request.method == 'OPTIONS') {
        return event.respondWith(response.cors())
    }

    return event.respondWith(handleRequest(event.request));
})
```
