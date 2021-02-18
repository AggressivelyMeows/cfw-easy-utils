---
id: response
title: 📦 Response utilities
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

## response.static
***response.static(request: Request, options: Object)***  

Returns your static assets to the Worker while adding asset to Cloudflare's cache. You must specify `baseUrl` as the root url you want all of the asset requests to be sent too. This can be any asset serving url such as S3 or DigitalOcean: Spaces.

#### Options
**baseUrl: String**
The base URL of the resource you want to fetch. For example: 'https://example.com'. Make sure you allow public reads from this bucket otherwise the Worker wont be able to fetch the resource.

**ttl: Integer**
The time in seconds for how long you wish to keep this asset cached on Cloudflare's servers. Defaults to `600` seconds (10 minutes).

**routePath: String**
If you are running this behind a route, you might want to use this to remove the route's prefix. For example, if you had this running behind `/cdn` you might want to remove `/cdn` from the asset path otherwise it might not find the asset you want. This will remove the string you pass from the Request path.

## response.json
***response.json(body: StringOrObject, options: OptionsObject)***  

Returns a response object ready to be returned to the client with correct headers set. Accepts either a plain JS object or an already serialized JSON string. If the body is anything other than an Object, easy-utils will just send that as the response and will not convert it for you.

```js
return response.json({ 'hello': 'world' })
```

## response.html
***response.html(body: String, options: OptionsObject)***  

Turns the body param into a valid HTML response. Does not sanitize HTML and will not validate for structure.

```js
return response.html('<p>hello, world!</p>')
```

## response.cors
***response.cors()*** 

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

##### cookies, default: `null`
If present, must be an instance of easy-utils's CookieJar. Please read documentation on CookieJar for more information.

##### stopwatch, default: `null`
If present, must be an instance of easy-utils's Stopwatch. Please read documentation on Stopwatch for more information.

---

## 💎 Header utilities
## response.setHeaders
***response.setHeaders(response: Response, name: String, value: String)***

Returns a **new** Response object with the headers set. Due to how JS handles responses, its safer to create a new Response object instead of fail to modify an immutable Response.

## response.headersToObject
***response.headersToObject(headers: Headers)***

Takes an Headers object and turns it into a plain JS object. Repeated headers 

```js title="Example"
var headers = response.headersToObject(request.headers)
```