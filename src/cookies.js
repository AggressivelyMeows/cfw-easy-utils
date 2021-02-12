var cookie = require('cookie');

class Jar { 
    constructor (request) {
        this.request = request

        if (request) {
            this.cookies = cookie.parse(request.headers.get('cookie') || '')
        } else {
            this.cookies = {}
        }
        
        this.futureCookies = {} // if we ever want to set cookies in the future, this is the source object
    }

    get(name) {
        return this.cookies[name]
    }

    set(name, value, options) {
        this.futureCookies[name] = {
            value,
            ...options
        }
    }

    __remove() {
        // entirely remove a cookie
        // TODO at somepoint if requested
    }

    values() {
        // returns an array of valid header values.
        var output = []
        for (const [key, options] of Object.entries(this.futureCookies)) {
            output.push(cookie.serialize(key, options.value, options))
        }

        return output
    }
}

export const cookies = {
    jar: Jar
}