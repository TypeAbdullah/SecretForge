const { randomString, randomBase64URL, randomHex } = require('../utils/crypto-helpers');
const crypto = require('crypto');
const CHARSETS = require('../utils/charset');

/**
 * OAuth & Authentication Secret Generators
 */
const oauth = {
    /**
     * Generate an OAuth client ID
     * @param {Object} options
     * @param {number} options.length - Length (default: 32)
     * @returns {string}
     */
    clientId(options = {}) {
        const { length = 32 } = options;
        return randomString(length, CHARSETS.ALPHANUMERIC);
    },

    /**
     * Generate an OAuth client secret
     * @param {Object} options
     * @param {number} options.length - Length (default: 64)
     * @returns {string}
     */
    clientSecret(options = {}) {
        const { length = 64 } = options;
        return randomString(length, CHARSETS.URL_SAFE);
    },

    /**
     * Generate an OAuth client ID + secret pair
     * @param {Object} options
     * @param {string} options.prefix - Prefix for client ID (default: '')
     * @returns {Object}
     */
    clientCredentials(options = {}) {
        const { prefix = '' } = options;
        const id = oauth.clientId();
        return {
            clientId: prefix ? `${prefix}_${id}` : id,
            clientSecret: oauth.clientSecret(),
            createdAt: new Date().toISOString(),
        };
    },

    /**
     * Generate a PKCE code verifier
     * @param {Object} options
     * @param {number} options.length - Length between 43-128 (default: 128)
     * @returns {string}
     */
    codeVerifier(options = {}) {
        const { length = 128 } = options;
        if (length < 43 || length > 128) {
            throw new Error('PKCE code verifier length must be between 43 and 128');
        }
        return randomString(length, CHARSETS.URL_SAFE);
    },

    /**
     * Generate a PKCE code challenge from a verifier
     * @param {string} verifier - Code verifier
     * @returns {Object} { codeVerifier, codeChallenge, method }
     */
    codeChallenge(verifier = null) {
        const codeVerifier = verifier || oauth.codeVerifier();
        const hash = crypto.createHash('sha256').update(codeVerifier).digest();
        const codeChallenge = hash.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
        return {
            codeVerifier,
            codeChallenge,
            method: 'S256',
        };
    },

    /**
     * Generate an authorization code
     * @param {Object} options
     * @param {number} options.length - Length (default: 32)
     * @returns {string}
     */
    authorizationCode(options = {}) {
        const { length = 32 } = options;
        return randomBase64URL(length);
    },

    /**
     * Generate a state parameter for CSRF protection
     * @param {Object} options
     * @param {number} options.length - Length (default: 32)
     * @returns {string}
     */
    state(options = {}) {
        const { length = 32 } = options;
        return randomBase64URL(length);
    },

    /**
     * Generate a nonce for OpenID Connect
     * @param {Object} options
     * @param {number} options.length - Length (default: 32)
     * @returns {string}
     */
    nonce(options = {}) {
        const { length = 32 } = options;
        return randomBase64URL(length);
    },
};

module.exports = oauth;