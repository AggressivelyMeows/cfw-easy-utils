![](https://media.spns.us/ext/easy-utils.png?w=128)

# CF Workers: easy-utils
*A library designed to make writing workers so much cleaner and easier!*

This library is going to a bunch of helpers for making your code easier to read.

You can find all of the documentation here https://easy-utils.docs.ceru.dev

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

## Install
`npm i cfw-easy-utils` 
