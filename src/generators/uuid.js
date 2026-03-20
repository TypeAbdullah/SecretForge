const crypto = require('crypto');
const { randomString, randomHex } = require('../utils/crypto-helpers');
const CHARSETS = require('../utils/charset');

/**
 * UUID & Unique ID Generators
 */
const uuid = {
    /**
     * Generate a UUID v4
     * @returns {string}
     */
    v4() {
        return crypto.randomUUID();
    },

    /**
     * Generate multiple UUIDs
     * @param {number} count - Number of UUIDs (default: 5)
     * @returns {string[]}
     */
    batch(count = 5) {
        return Array.from({ length: count }, () => crypto.randomUUID());
    },

    /**
     * Generate a short unique ID
     * @param {Object} options
     * @param {number} options.length - Length (default: 12)
     * @returns {string}
     */
    short(options = {}) {
        const { length = 12 } = options;
        return randomString(length, CHARSETS.URL_SAFE);
    },

    /**
     * Generate a nano ID (URL-safe unique string)
     * @param {Object} options
     * @param {number} options.length - Length (default: 21)
     * @param {string} options.alphabet - Custom alphabet (default: URL_SAFE)
     * @returns {string}
     */
    nano(options = {}) {
        const { length = 21, alphabet = CHARSETS.URL_SAFE } = options;
        return randomString(length, alphabet);
    },

    /**
     * Generate a prefixed unique ID
     * @param {Object} options
     * @param {string} options.prefix - Prefix (default: 'id')
     * @param {number} options.length - Length after prefix (default: 16)
     * @returns {string}
     */
    prefixed(options = {}) {
        const { prefix = 'id', length = 16 } = options;
        return `${prefix}_${randomString(length, CHARSETS.ALPHANUMERIC)}`;
    },

    /**
     * Generate a sortable unique ID (timestamp + random, similar to ULID)
     * @returns {string}
     */
    sortable() {
        const timestamp = Date.now().toString(36).padStart(9, '0');
        const random = randomString(16, CHARSETS.ALPHANUMERIC.toLowerCase());
        return timestamp + random;
    },

    /**
     * Generate a CUID-like ID
     * @returns {string}
     */
    cuid() {
        const timestamp = Date.now().toString(36);
        const random = randomString(12, CHARSETS.LOWERCASE + CHARSETS.DIGITS);
        const fingerprint = randomString(4, CHARSETS.LOWERCASE);
        return `c${timestamp}${fingerprint}${random}`;
    },

    /**
     * Generate an ObjectId-like string (similar to MongoDB)
     * @returns {string}
     */
    objectId() {
        const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
        const random = randomHex(8);
        return timestamp + random;
    },
};

module.exports = uuid;