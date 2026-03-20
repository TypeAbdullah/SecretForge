const { randomString, randomHex, randomBase64, randomBase64URL, calculateEntropy } = require('./utils/crypto-helpers');
const CHARSETS = require('./utils/charset');
const crypto = require('crypto');

/**
 * Core / General-Purpose Secret Generators
 */
const core = {
    /**
     * Generate a generic secret
     * @param {Object} options
     * @param {number} options.length - Length in bytes (default: 32)
     * @param {string} options.encoding - 'hex' | 'base64' | 'base64url' | 'alphanumeric' (default: 'hex')
     * @returns {string}
     */
    secret(options = {}) {
        const { length = 32, encoding = 'hex' } = options;
        switch (encoding) {
            case 'base64': return randomBase64(length);
            case 'base64url': return randomBase64URL(length);
            case 'alphanumeric': return randomString(length, CHARSETS.ALPHANUMERIC);
            case 'hex':
            default: return randomHex(length);
        }
    },

    /**
     * Generate raw random bytes
     * @param {number} length - Number of bytes
     * @returns {Buffer}
     */
    bytes(length = 32) {
        return crypto.randomBytes(length);
    },

    /**
     * Generate a hex string
     * @param {number} length - Number of bytes (output is 2x)
     * @returns {string}
     */
    hex(length = 32) {
        return randomHex(length);
    },

    /**
     * Generate a base64 string
     * @param {number} length - Number of bytes
     * @returns {string}
     */
    base64(length = 32) {
        return randomBase64(length);
    },

    /**
     * Generate a URL-safe base64 string
     * @param {number} length - Number of bytes
     * @returns {string}
     */
    base64url(length = 32) {
        return randomBase64URL(length);
    },

    /**
     * Generate an .env file content with all common secrets
     * @param {Object} options
     * @param {string} options.appName - Application name
     * @returns {string}
     */
    dotenv(options = {}) {
        const { appName = 'MYAPP' } = options;
        const prefix = appName.toUpperCase().replace(/[^A-Z0-9]/g, '_');

        const jwtGen = require('./generators/jwt');
        const dbGen = require('./generators/database');
        const sessionGen = require('./generators/session');
        const apiGen = require('./generators/api');

        const lines = [
            `# ==========================================`,
            `# ${appName} - Auto-generated Secrets`,
            `# Generated at: ${new Date().toISOString()}`,
            `# WARNING: Keep this file secure!`,
            `# ==========================================`,
            ``,
            `# JWT Secrets`,
            `${prefix}_JWT_ACCESS_SECRET=${jwtGen.accessSecret({ encoding: 'base64url' })}`,
            `${prefix}_JWT_REFRESH_SECRET=${jwtGen.refreshSecret({ encoding: 'base64url' })}`,
            ``,
            `# Session Secrets`,
            `${prefix}_SESSION_SECRET=${sessionGen.secret()}`,
            `${prefix}_COOKIE_SECRET=${sessionGen.cookieSecret()}`,
            `${prefix}_CSRF_SECRET=${sessionGen.csrfToken({ length: 48 })}`,
            ``,
            `# Database`,
            `${prefix}_DB_PASSWORD=${dbGen.password()}`,
            `${prefix}_DB_ENCRYPTION_KEY=${dbGen.encryptionKey()}`,
            ``,
            `# API Keys`,
            `${prefix}_API_KEY=${apiGen.key()}`,
            `${prefix}_API_SECRET=${apiGen.key({ length: 64 })}`,
            ``,
            `# Encryption`,
            `${prefix}_ENCRYPTION_KEY=${randomHex(32)}`,
            `${prefix}_ENCRYPTION_IV=${randomHex(16)}`,
            ``,
            `# Webhook`,
            `${prefix}_WEBHOOK_SECRET=whsec_${randomString(64, CHARSETS.URL_SAFE)}`,
            ``,
            `# Redis`,
            `${prefix}_REDIS_PASSWORD=${dbGen.redisPassword()}`,
            ``,
            `# General`,
            `${prefix}_APP_SECRET=${randomBase64URL(48)}`,
            `${prefix}_HASH_SALT=${randomHex(32)}`,
        ];

        return lines.join('\n');
    },

    /**
     * Analyze a secret's strength
     * @param {string} secret - The secret to analyze
     * @returns {Object}
     */
    analyze(secret) {
        const length = secret.length;
        const uniqueChars = new Set(secret).size;
        const entropy = calculateEntropy(secret);

        const hasLower = /[a-z]/.test(secret);
        const hasUpper = /[A-Z]/.test(secret);
        const hasDigit = /[0-9]/.test(secret);
        const hasSymbol = /[^a-zA-Z0-9]/.test(secret);

        let strength = 'very-weak';
        if (entropy >= 128) strength = 'excellent';
        else if (entropy >= 80) strength = 'strong';
        else if (entropy >= 60) strength = 'good';
        else if (entropy >= 40) strength = 'moderate';
        else if (entropy >= 20) strength = 'weak';

        return {
            length,
            uniqueChars,
            entropy: `${entropy} bits`,
            strength,
            composition: {
                lowercase: hasLower,
                uppercase: hasUpper,
                digits: hasDigit,
                symbols: hasSymbol,
            },
        };
    },

    /**
     * Generate secrets in multiple formats at once
     * @param {number} byteLength - Number of bytes (default: 32)
     * @returns {Object}
     */
    allFormats(byteLength = 32) {
        const bytes = crypto.randomBytes(byteLength);
        return {
            hex: bytes.toString('hex'),
            base64: bytes.toString('base64'),
            base64url: bytes.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''),
            binary: bytes,
            length: byteLength,
        };
    },
};

module.exports = core;