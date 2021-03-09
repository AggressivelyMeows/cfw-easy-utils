---
id: websockets
title: 🔌 Websocket utilities
---

Want to run a Websocket server OR client at the edge? Now you can with the ease of use you love with cfw-easy-utils!

```js title="Client and server example"
import { response, WebsocketResponse, Websocket } from 'cfw-easy-utils'

// This example is a simple Websocket proxy that intercepts
// and processes the messages at the edge.
var resp = new WebsocketResponse()
var ws = new Websocket('ws://echo.websocket.org')

ws.on('message', (msg) => {
    // data coming from the external service
    resp.send(msg)
})

resp.on('message', (msg) => {
    // data coming from the end user
    ws.send(msg)
})

return response.websocket(resp)
```

---

## Websocket
***new Websocket(url)***

Creates a new Websocket client. Works exactly like you would expect from a Websocket client however it hides a lot of the messy stuff you would have to deal with as a developer.

### on(event: String, callback: Function)

Runs a function every time an event is triggered. Example events include `message`, `ready`, and `closed`. CFW-EU will try its best to decode the incoming event but if it fails for whatever reason, the full body will be sent to the callback. For example, if you are using a JSON Websocket server, we will try to parse but it is failsafe.

:::info
You can also use `addEventListener` if you want to keep compatibility with existing code. Be aware that addEventListener'ed events will **not** be processed by this lib. It is a straight passthrough.
:::

### send(body: [WebsocketValidBody](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send#syntax))

Sends the body to the client. If the body is a plain JS Object or Array, it will be JSON'ifyed before being sent. Any other type of body will be left as is to be sent as a Binary frame.

```js title="Not part of the official standard but its available as a nice helper:"
socket.send({ some: data })
```

## WebsocketResponse
***new WebsocketResponse()***  

Returns easy-util's Websocket client. Designed to make it easier to create a Websocket server at the edge.

### on(event: String, callback: Function)

Runs the callback function every time the event is fired. Check MDN for Websocket based events, they are effectively the same except for message.

**message** - Fired when a new message is received by the Websocket client. The body is attempted to be converted to JSON but if it fails, it will just be sent to the client.

### send(body: [WebsocketValidBody](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send#syntax))

Sends the body to the client. If the body is a plain JS Object or Array, it will be JSON'ifyed before being sent. Any other type of body will be left as is to be sent as a Binary frame.
