---
id: stopwatch
title: ⌚ Stopwatch
---

Time your code and monitor slow downs with external services!

### Heads up
CF Workers cannot count their own CPU time however they are allowed to count I/O time. This library is designed to assist with monitoring fetch requests and other I/O such as Database requests.

```js title="Example"
import { Stopwatch } from 'cfw-easy-utils'

var watch = new Stopwatch()
var resp = await fetch('https://example.com/')

watch.mark('Fetched API resources')

// inside the Server-Timing header, you can find the duration.
// Most modern browsers also show this information in the "Timing" tab.
return response.fromResponse(resp, { stopwatch: watch })
```

### Why?
*"If CF Workers cant count CPU time, whats the point?" ~ Random user*  
The point of Stopwatch is to break down your internal requests for debugging. If you rely on an external service and it slows down, you can monitor using this library. Maybe in the future, I can add a utility to save these in KV so you can view them in a dashboard.