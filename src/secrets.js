// I wanted to call this "crypto", but that would overwrite the real crypto library in JS :(

function bufferToHexString(buffer) {
    var s = '', h = '0123456789abcdef';
    (new Uint8Array(buffer)).forEach((v) => { s += h[v >> 4] + h[v & 15]; });
    return s;
}

function hexStringToArrayBuffer(hexString) {
    // remove the leading 0x
    hexString = hexString.replace(/^0x/, '');
    
    // ensure even number of characters
    if (hexString.length % 2 != 0) {
        console.log('WARNING: expecting an even number of characters in the hexString');
    }
    
    // check for some non-hex characters
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        console.log('WARNING: found non-hex characters', bad);    
    }
    
    // split the string into pairs of octets
    var pairs = hexString.match(/[\dA-F]{2}/gi);
    
    // convert the octets to integers
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });
    
    var array = new Uint8Array(integers);
    
    return array.buffer;
}

export const secrets = {
    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    },
	async hashPassword(password, options) {
        var options = options || {}
        var salt = options.salt || crypto.getRandomValues(new Uint8Array(8))
        var iterations = options.iterations || 45000

        if (typeof salt == 'string') {
            // this means we are validating a password
            // or the user is using a String salt
            salt = hexStringToArrayBuffer(salt)
        }
        
        const encoder = new TextEncoder('utf-8')
        
        const passphraseKey = encoder.encode(password)

        const key = await crypto.subtle.importKey(
            'raw',
            passphraseKey, 
            {name: 'PBKDF2'}, 
            false, 
            ['deriveBits', 'deriveKey']
        )
        
        const webKey = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt,
                iterations,
                hash: 'SHA-256'
            },
            key,
            // Don't actually need a cipher suite,
            // but api requires it is specified.
            { name: 'AES-CBC', length: 256 },
            true,
            [ "encrypt", "decrypt" ]
        )

        const hash = await crypto.subtle.exportKey("raw", webKey)

        // return a easy-utils password hash that can be stored in KV
        // contains all of the info we need to check later.
		return `$PBKDF2;h=${bufferToHexString(hash)};s=${bufferToHexString(salt)};i=${iterations};`
    },
    async validatePassword(password, existingPassword) {
        var options = {
            salt: existingPassword.split(';s=')[1].split(';')[0],
            iterations: existingPassword.split(';i=')[1].split(';')[0]
        }

        var hashedPassword = await this.hashPassword(password, options)

        var isValid = true

        // we don't return right away to stop key based timing attacks
        for (var i = 0; i < hashedPassword.length; i++) {
            if (hashedPassword.charAt(i) != existingPassword.charAt(i)) {
                isValid = false // this can only be set to false.
            }
        }
        
        return isValid
    }
}