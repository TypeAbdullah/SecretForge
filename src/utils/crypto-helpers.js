const crypto = require('crypto');
const CHARSETS = require('./charset');

/**
 * Generate cryptographically secure random bytes
 * @param {number} length - Number of bytes
 * @returns {Buffer}
 */
function randomBytes(length) {
    return crypto.randomBytes(length);
}

/**
 * Generate a random string from a given charset
 * @param {number} length - Length of the string
 * @param {string} charset - Characters to pick from
 * @returns {string}
 */
function randomString(length, charset = CHARSETS.ALPHANUMERIC) {
    const bytes = crypto.randomBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charset[bytes[i] % charset.length];
    }
    return result;
}

/**
 * Generate a hex string
 * @param {number} byteLength - Number of bytes (output will be 2x this length)
 * @returns {string}
 */
function randomHex(byteLength) {
    return crypto.randomBytes(byteLength).toString('hex');
}

/**
 * Generate a base64 string
 * @param {number} byteLength - Number of bytes
 * @returns {string}
 */
function randomBase64(byteLength) {
    return crypto.randomBytes(byteLength).toString('base64');
}

/**
 * Generate a URL-safe base64 string
 * @param {number} byteLength - Number of bytes
 * @returns {string}
 */
function randomBase64URL(byteLength) {
    return crypto.randomBytes(byteLength)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Calculate entropy of a string in bits
 * @param {string} str
 * @returns {number}
 */
function calculateEntropy(str) {
    const charsetSize = new Set(str).size;
    return Math.floor(str.length * Math.log2(charsetSize));
}

/**
 * Hash a string using specified algorithm
 * @param {string} data
 * @param {string} algorithm - 'sha256', 'sha512', etc.
 * @returns {string}
 */
function hash(data, algorithm = 'sha256') {
    return crypto.createHash(algorithm).update(data).digest('hex');
}

/**
 * Generate HMAC
 * @param {string} data
 * @param {string} key
 * @param {string} algorithm
 * @returns {string}
 */
function hmac(data, key, algorithm = 'sha256') {
    return crypto.createHmac(algorithm, key).update(data).digest('hex');
}

module.exports = {
    randomBytes,
    randomString,
    randomHex,
    randomBase64,
    randomBase64URL,
    calculateEntropy,
    hash,
    hmac,
};