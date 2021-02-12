---
id: response
title: 📦 Response utils
---

This is a collection of helpers to make responding to requests easier. The core idea is to reduce errors, and make your code easier to read by moving a lot of the repeated code into its own package.

```js title="Before - ❌ Messy, hard to change if theres an issue."
return new Response(
    JSON.stringify({ 'hello': 'world' }),
    { headers: { 'content-type': 'application/json' } },
)
```

```js title="After - 🦄 Much cleaner."
return response.json({ 'hello': 'world!' })
```

---

### response.json(body: Object, options: OptionsObject)
Returns a response object ready to be returned to the client with correct headers set. Accepts either a plain JS object or an already serialized JSON string. If the body is anything other than an Object, easy-utils will just send that as the response and will not convert it for you.

```js
return response.json({ 'hello': 'world' })
```

### response.html/.text(body: String, options: OptionsObject)
Helper function to handle specific types of content to return. `response.html` and `response.text` do effectively the same thing but they have different `Content-Type` headers.

```js
return response.html('<p>hello, world!</p>')
// OR
return response.text('This is just some plain text.')
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

---
#### OptionsObject
An object describing what extras to modify the response with. Almost all of the response functions accept this as the second argument except where stated.

##### headers, default: `{}`
An object for setting the response headers. Adding headers this way will overwrite any existing headers that easy-utils sets.

##### status, default: `200`
The status of the response. Defaults to 200, status message will be ignored by Cloudflare's CDN but we support setting it for other environments.

##### autoCors, default: `true`
Adds standard CORS headers to the response so you don't have to deal with CORS errors. To set the default values, set the values on the response module you imported:

```js title="Set origin globally"
import { response } from 'cfw-easy-utils'
response.accessControl.allowOrigin = 'https://example.com'
```

```js title="Make easy-utils 'Origin-Aware'"
import { response } from 'cfw-easy-utils'
// setting .request means easy-utils will try to use the
// origin of the inbound request for its CORS data.
response.request = request 
return response.json()
```

```js title="Full example of some options"
{
    headers: { 'Location': 'https://example.com' }, // default: {}
    status: 301, // default: 200
    autoCors: false, // default: true
}
```

---

## Response header utils
### response.setHeaders(response: Response, name: String, value: String)
Returns a **new** Response object with the headers set. Due to how JS handles responses, its safer to create a new Response object instead of fail to modify an immutable Response.

### response.headersToObject(headers: Headers)
Takes an Headers object and turns it into a plain JS object. Simple helper function that condenses about 4 lines of code into one.

```js title="Example"
var headers = response.headersToObject(request.headers)
```