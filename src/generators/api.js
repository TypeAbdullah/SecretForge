const { randomString, randomHex, randomBase64URL } = require('../utils/crypto-helpers');
const CHARSETS = require('../utils/charset');

/**
 * API Key & Token Generators
 */
const api = {
    /**
     * Generate a simple API key
     * @param {Object} options
     * @param {number} options.length - Length (default: 48)
     * @param {string} options.prefix - Prefix (default: '')
     * @returns {string}
     */
    key(options = {}) {
        const { length = 48, prefix = '' } = options;
        const key = randomString(length, CHARSETS.ALPHANUMERIC);
        return prefix ? `${prefix}_${key}` : key;
    },

    /**
     * Generate a prefixed API key (like Stripe's sk_live_xxx)
     * @param {Object} options
     * @param {string} options.prefix - Prefix (default: 'sk')
     * @param {string} options.environment - 'live' | 'test' (default: 'live')
     * @param {number} options.length - Key length (default: 48)
     * @returns {string}
     */
    prefixedKey(options = {}) {
        const { prefix = 'sk', environment = 'live', length = 48 } = options;
        const key = randomString(length, CHARSETS.ALPHANUMERIC);
        return `${prefix}_${environment}_${key}`;
    },

    /**
     * Generate an API key pair (public + secret)
     * @param {Object} options
     * @param {string} options.prefix - Prefix (default: 'app')
     * @returns {Object} { publicKey, secretKey }
     */
    keyPair(options = {}) {
        const { prefix = 'app' } = options;
        return {
            publicKey: `${prefix}_pk_${randomString(40, CHARSETS.ALPHANUMERIC)}`,
            secretKey: `${prefix}_sk_${randomString(48, CHARSETS.ALPHANUMERIC)}`,
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Generate a bearer token
     * @param {Object} options
     * @param {number} options.length - Length in bytes (default: 48)
     * @returns {string}
     */
    bearerToken(options = {}) {
        const { length = 48 } = options;
        return randomBase64URL(length);
    },

    /**
     * Generate a GraphQL API key
     * @param {Object} options
     * @returns {string}
     */
    graphqlKey(options = {}) {
        const { length = 40 } = options;
        return `gql_${randomString(length, CHARSETS.ALPHANUMERIC)}`;
    },

    /**
     * Generate a REST API key with metadata
     * @param {Object} options
     * @param {string} options.appName - Application name
     * @param {string[]} options.scopes - Permission scopes
     * @returns {Object}
     */
    restApiKey(options = {}) {
        const { appName = 'myapp', scopes = ['read'] } = options;
        return {
            keyId: `kid_${randomString(12, CHARSETS.ALPHANUMERIC)}`,
            apiKey: `rk_${randomString(48, CHARSETS.ALPHANUMERIC)}`,
            appName,
            scopes,
            createdAt: new Date().toISOString(),
        };
    },
};

module.exports = api;