---
id: websockets
title: 🔌 Websocket utilities
---

Create a Worker with the ability to return a Websocket. Allow two-way access to your data, reduce latency, and other things with easy-utils!

```js title="Example"
import { response, WebsocketResponse } from 'cfw-easy-utils'

var socket = new WebsocketResponse()

socket.on('message', (msg) => {
    // incoming data will be converted to JSON if possible.
    // if you send a Blob, ArrayBuffer, etc, it will be left alone.

    // same with .send, a plain Object or Array will be JSON encoded.
    // anything else will be left as is.
    socket.send(msg)
})

return response.websocket(socket)
```

---

## WebsocketResponse
***new WebsocketResponse()***  

Returns easy-util's Websocket client. Designed to make it easier to create a Websocket server at the edge.

### on(event: String, callback: Function)

Runs the callback function every time the event is fired. Check MDN for Websocket based events, they are effectively the same except for message.

**message** - Fired when a new message is received by the Websocket client. The body is attempted to be converted to JSON but if it fails, it will just be sent to the client.

### send(body: [WebsocketValidBody](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send#syntax))

Sends the body to the client. If the body is a plain JS Object or Array, it will be JSON'ifyed before being sent. Any other type of body will be left as is to be sent as a Binary frame.
