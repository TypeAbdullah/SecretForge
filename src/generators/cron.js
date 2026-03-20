const { randomString, randomHex, randomBase64URL, hmac } = require('../utils/crypto-helpers');
const CHARSETS = require('../utils/charset');

/**
 * Cron & Scheduled Task Secret Generators
 */
const cron = {
    /**
     * Generate a cron job secret for securing cron endpoints
     * @param {Object} options
     * @param {number} options.length - Length (default: 64)
     * @param {string} options.prefix - Prefix (default: 'cron_')
     * @returns {string}
     */
    secret(options = {}) {
        const { length = 64, prefix = 'cron_' } = options;
        return prefix + randomString(length, CHARSETS.URL_SAFE);
    },

    /**
     * Generate a cron authentication token
     * @param {Object} options
     * @param {number} options.length - Length in bytes (default: 32)
     * @returns {string}
     */
    authToken(options = {}) {
        const { length = 32 } = options;
        return randomBase64URL(length);
    },

    /**
     * Generate a signed cron token with timestamp for time-based validation
     * @param {Object} options
     * @param {string} options.secret - Secret key for signing
     * @param {number} options.validityMinutes - Token validity in minutes (default: 5)
     * @returns {Object} { token, timestamp, signature, fullToken }
     */
    signedToken(options = {}) {
        const { secret = randomHex(32), validityMinutes = 5 } = options;
        const timestamp = Date.now();
        const expiresAt = timestamp + (validityMinutes * 60 * 1000);
        const payload = `${timestamp}:${expiresAt}`;
        const signature = hmac(payload, secret);
        return {
            token: `${payload}:${signature}`,
            timestamp,
            expiresAt,
            secret,
            signature,
        };
    },

    /**
     * Generate a cron job API key with metadata
     * @param {Object} options
     * @param {string} options.jobName - Name of the cron job
     * @returns {Object}
     */
    jobKey(options = {}) {
        const { jobName = 'default' } = options;
        const key = randomString(48, CHARSETS.URL_SAFE);
        const id = randomString(8, CHARSETS.ALPHANUMERIC);
        return {
            jobId: `job_${id}`,
            jobName,
            apiKey: `cronkey_${key}`,
            createdAt: new Date().toISOString(),
        };
    },
};

module.exports = cron;