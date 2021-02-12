// I wanted to call this "crypto", but that would overwrite the real crypto library in JS :(

// Undocumented for now until I can figure out what else to add. You are free to use these
// utilities but I don't offer any form of warranty on them.

export const secrets = {
    // 100% credit goes to https://stackoverflow.com/a/2117523
    uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    }
}