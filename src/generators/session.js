const { randomString, randomBase64URL, randomHex } = require('../utils/crypto-helpers');
const CHARSETS = require('../utils/charset');

/**
 * Session & Cookie Secret Generators
 */
const session = {
    /**
     * Generate a session secret
     * @param {Object} options
     * @param {number} options.length - Length in bytes (default: 64)
     * @param {string} options.encoding - 'hex' | 'base64' | 'base64url' (default: 'hex')
     * @returns {string}
     */
    secret(options = {}) {
        const { length = 64, encoding = 'hex' } = options;
        switch (encoding) {
            case 'base64': return require('../utils/crypto-helpers').randomBase64(length);
            case 'base64url': return randomBase64URL(length);
            case 'hex':
            default: return randomHex(length);
        }
    },

    /**
     * Generate a session ID
     * @param {Object} options
     * @param {number} options.length - Length (default: 32)
     * @param {string} options.prefix - Prefix (default: 'sess_')
     * @returns {string}
     */
    id(options = {}) {
        const { length = 32, prefix = 'sess_' } = options;
        return prefix + randomBase64URL(length);
    },

    /**
     * Generate a cookie signing secret
     * @param {Object} options
     * @param {number} options.length - Length in bytes (default: 32)
     * @returns {string}
     */
    cookieSecret(options = {}) {
        const { length = 32 } = options;
        return randomBase64URL(length);
    },

    /**
     * Generate a CSRF token
     * @param {Object} options
     * @param {number} options.length - Length (default: 32)
     * @returns {string}
     */
    csrfToken(options = {}) {
        const { length = 32 } = options;
        return randomBase64URL(length);
    },

    /**
     * Generate multiple session secrets for rotation
     * @param {Object} options
     * @param {number} options.count - Number of secrets (default: 3)
     * @param {number} options.length - Length of each secret (default: 64)
     * @returns {string[]}
     */
    rotationSecrets(options = {}) {
        const { count = 3, length = 64 } = options;
        return Array.from({ length: count }, () => session.secret({ length }));
    },

    /**
     * Generate Express/Connect session configuration secrets
     * @returns {Object}
     */
    expressConfig() {
        return {
            sessionSecret: session.secret(),
            cookieSecret: session.cookieSecret(),
            csrfSecret: session.csrfToken({ length: 48 }),
            rotationSecrets: session.rotationSecrets(),
        };
    },
};

module.exports = session;