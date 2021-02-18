# 🦄 CF Workers: easy-utils
*A library designed to make writing workers so much cleaner and easier!*

Welcome to easy-utils, this library is designed to make writing Workers easy as heck. Included in this package is a bunch of helpers for responses, profiling*, handling cookies, and serving any static assets.

Turn your Worker code from spaghetti hell to majestic artwork today with easy-utils.

**Documentation**:
## https://easy-utils.docs.ceru.dev

---

## 🔧 Install
`npm i cfw-easy-utils` 

## ✨ Examples

### No more JSON.stringify!
Stuck having to copy paste the same 4 lines of code just to return a simple JSON object? Now you can easily return any JSON-compatible object/array without having to worry about your code getting complex.
```js
return response.json({ 'hello': 'world!' })
```

### Cache S3 buckets & more!
Want to save money on your bill? Cache your assets on the edge and speed up your images. No more having to Google for hours trying to get a solution to work.
```js
return response.static(request, { baseUrl: 'https://yourbucket.net' })
```

### Handle CORS with a breeze!
CORS can be so cumbersome and annoying. Let easy-utils handle it for you so you can focus on your Worker's real purpose.
```js
if (request.method == 'OPTIONS') {
    return response.cors()
}

// autoCors is true by default, but we want to show it off.
return response.json({ hello: 'World' }, { autoCors: true })
```