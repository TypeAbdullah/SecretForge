const { randomString, randomHex, hmac } = require('../utils/crypto-helpers');
const CHARSETS = require('../utils/charset');

/**
 * Webhook Secret Generators
 */
const webhook = {
    /**
     * Generate a webhook signing secret
     * @param {Object} options
     * @param {number} options.length - Length (default: 64)
     * @param {string} options.prefix - Prefix (default: 'whsec_')
     * @returns {string}
     */
    secret(options = {}) {
        const { length = 64, prefix = 'whsec_' } = options;
        return prefix + randomString(length, CHARSETS.URL_SAFE);
    },

    /**
     * Generate a webhook verification token
     * @param {Object} options
     * @param {number} options.length - Length (default: 32)
     * @returns {string}
     */
    verificationToken(options = {}) {
        const { length = 32 } = options;
        return randomHex(length);
    },

    /**
     * Sign a webhook payload
     * @param {string|Object} payload - The payload to sign
     * @param {string} secret - The signing secret
     * @param {Object} options
     * @param {string} options.algorithm - Hash algorithm (default: 'sha256')
     * @param {string} options.prefix - Signature prefix (default: 'sha256=')
     * @returns {Object} { signature, timestamp, signedPayload }
     */
    sign(payload, secret, options = {}) {
        const { algorithm = 'sha256', prefix = 'sha256=' } = options;
        const timestamp = Math.floor(Date.now() / 1000);
        const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
        const signedPayload = `${timestamp}.${body}`;
        const signature = hmac(signedPayload, secret, algorithm);
        return {
            signature: prefix + signature,
            timestamp,
            header: `t=${timestamp},v1=${signature}`,
        };
    },

    /**
     * Generate a complete webhook configuration
     * @param {Object} options
     * @param {string} options.service - Service name
     * @returns {Object}
     */
    config(options = {}) {
        const { service = 'myapp' } = options;
        return {
            id: `wh_${randomString(16, CHARSETS.ALPHANUMERIC)}`,
            service,
            signingSecret: webhook.secret(),
            verificationToken: webhook.verificationToken(),
            createdAt: new Date().toISOString(),
        };
    },
};

module.exports = webhook;