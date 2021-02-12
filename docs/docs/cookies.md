---
id: cookies
title: 🍪 Cookie utils
---

This section of the package focuses on cookies and how to integrate them with your Worker.


```js title="Example"
import { response, cookie } from 'cfw-easy-utils'

// you don't need a request to make this work but its needed if you want to read
// existing cookies.
var cookieJar = cookie.jar(request)

var token = cookies.get('authToken')
var user = JSON.parse(cookieJar.get('user'))

if (!token) {
    cookieJar.set('authToken', 'tokenvalue') // accepts any string value
    cookieJar.set('user', JSON.stringify({ id: 1, username: 'Cerulean' }))
    
    // all of easy-util's response helpers have native support for cookies,
    // you just need to provide a cookie jar object.
    return response.json({ hello: world }, { cookies: cookieJar })
}

return response.text(`You are logged in with this token: "${cookieJar.get('authToken')}"`)
```

:::warning

Be aware that cookie.jar will *not* set existing cookies when doing `setHeaders`. Browsers will keep cookies until they expire so we felt this was un-necessary to keep setting existing cookies.

:::

---

### cookie.jar(request: Request or Null)
Returns a new CookieJar object. This allows you to read the request's cookies or set your own. Be aware that cookies read from the request wont be saved by default. If you want to send the cookies that were sent with the request back, you need to iterate over the cookies and add them to the CookieJar.

```js title="Example"
import { cookie } from 'cfw-easy-utils'

// inside the request handler
var cookieJar = cookie.jar(request)
```

### CookieJar.get(key: String)
Returns the cookies value, or it will return an empty string if no value was found.

### CookieJar.set(key: String, value: String, options: Object)
Sets the cookie value. Returns `null`.

The options object accepts values for the cookie. For example, you can set the secure mode via { secure: true }. 

:::info

If you want to append your cookies to a response, you can slot the CookieJar object into any of easy-util's response helpers.

```js
return response.json({}, { cookies: cookieJar })
```

:::