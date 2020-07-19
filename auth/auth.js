const jwt = require('jsonwebtoken');

const secret_key = process.env.ACCESS_TOKEN_SECRET || 'secret.key';

/** This function is not used yet **/
module.exports.validateJwt = (event) => {
    // Converting secret key to sequence of bytes (same as it is implemented in Java API)
    const toUTF8Array = (str) => {
        var utf8 = [];
        for (var i=0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode>>6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            else {
                i++;
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                    | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >>18),
                    0x80 | ((charcode>>12) & 0x3f),
                    0x80 | ((charcode>>6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

    if(event && event.headers && event.headers.Authorization) {

        const tokenParts = event.headers.Authorization.split(' ');
        const tokenValue = tokenParts[1];

        if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
            // no auth token!
            return 'unauthorized';
        }

        try {
            const decoded = jwt.verify(tokenValue, toUTF8Array(secret_key));
            return decoded;
        } catch (err) {
            console.log('catch error. Invalid token', err);
            return 'unauthorized';
        }
    } else {
        console.log('unauthorized');
        return 'unauthorized';
    }

}
