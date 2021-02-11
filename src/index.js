export const response = {
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

    _genericResponse(mimetype, body, options) {
        // helper function to make developing this easier.
        if (typeof options === 'undefined') { var options = {} }
        var extraHeaders = options.headers || {}
        var status = options.status || 200
        var statusText = options.statusText || 'OK'
        var autoCors = options.autoCors
        // use different method since we want a bool which can be false.
        if (typeof options.autoCors === 'undefined') { autoCors = true }

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

        return new Response(
            body,
            {
                status,
                statusText,
                headers
            }
        )
    },

    cors() {
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
    }
}