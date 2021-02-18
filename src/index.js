export * from './cookies.js'
export * from './secrets.js'
export * from './stopwatch.js'

var version = '{{ packageVersion }}'

export const response = {
    version,
    config: {
        debugHeaders: true
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'GET, POST, PUT',
        allowHeaders: 'Content-Type',
    },

    request: null, // if this is set, we need to use the origin of the request for our CORS headers.

    _corsHeaders() {
        var origin = this.accessControl.allowOrigin
        
        if (this.request) {
            // we have a request object, lets use its origin as our CORS origin.
            origin = new URL(this.request.url).origin
        }

        return {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': this.accessControl.allowMethods,
            'Access-Control-Max-Age': '1728000'
        }
    },

    injectCors(response, options) {
        // modify a response object to have CORS headers.
        var headers = this._corsHeaders()
    },

    _genericResponse(mimetype, body, options) {
        // helper function to make developing this easier.
        if (typeof options === 'undefined') { var options = {} }
        var extraHeaders = options.headers || {}
        var status = options.status || 200
        var statusText = options.statusText || 'OK'
        var autoCors = options.autoCors
        // use different method since we want a bool which can be false.
        if (typeof options.autoCors === 'undefined') { autoCors = true }

        var cookies = options.cookies || null
        var stopwatch = options.stopwatch || null

        var headers = {
            'Content-Type': mimetype,
            ...extraHeaders
        }

        if (autoCors) {
            headers = {
                ...headers,
                ...this._corsHeaders()
            }
        }

        var resp = new Response(
            body,
            {
                status,
                statusText,
                headers
            }
        )

        if (cookies) {
            var val = cookies.values()

            val.forEach(header => {
                resp.headers.append('Set-Cookie', header)
            })
        }

        if (stopwatch) {
            resp.headers.set('Server-Timing', stopwatch.getHeader())
        }

        if (this.config.debugHeaders) {
            resp.headers.set('x-cfw-eu-version', this.version)
        }
        

        return resp
    },

    cors(request) {
        if (request) {
            // set request so we can make our headers origin-aware.
            this.request = request
        }

        return new Response(null, { headers: this._corsHeaders() })
    },

    json(stringOrObject, options) {
        // turns a JSON body into a response object with valid headers.
        var body = stringOrObject
        
        if (typeof body != 'string') {
            // presume that this is an not already encoded JSON
            // string so we need to force it to JSON.
            body = JSON.stringify(stringOrObject)
        }

        return this._genericResponse(
            'application/json',
            body,
            options
        )
    },

    html(body, options) {
        return this._genericResponse(
            'text/html',
            body,
            options
        )
    },

    text(body, options) {
        return this._genericResponse(
            'plain/text',
            body,
            options
        )
    },

    fromResponse(resp, options) {
        var oldHeaders = this.headersToObject(resp.headers)

        var headers = {
            ...oldHeaders,
            ...options.headers || {}
        }

        if ('headers' in options) {
            delete options.headers
        }

        var contentType = JSON.parse(JSON.stringify(headers['content-type'])) // force new String

        if ('content-type' in headers) {
            delete headers['content-type'] // to stop multiple Content-Type headers.
        }

        return this._genericResponse(
            contentType,
            resp.body,
            {
                headers,
                ...options
            }
        )
    },

    async static(request, options) {
        var baseUrl = options.baseUrl
        if (!baseUrl) {
            throw 'You need to specify a baseUrl for response.static to work.'
        }

        let url = new URL(request.url)

        // wrap this fetch in our custom Response formatter
        var resp = await fetch(
            `${baseUrl}${url.pathname.replace(options.routePrefix || '<>', '')}`,
            {
                cf: {
                    cacheTtl: options.ttl || 600,
                }
            }
        )

        return this.fromResponse(resp, options)
    },

    setHeader(response, key, value) {
        var resp = new Response(response.body, response)
        var val = value
        if (typeof value.values == 'function') {
            // our values function returns an array
            val = value.values()

            val.forEach(header => {
                resp.headers.append(key, header)
            })
        } else {
            resp.headers.append(key, val)
        }
        
        return resp
    },

    headersToObject(headers) {
        return Object.fromEntries(headers.entries())
    }
}