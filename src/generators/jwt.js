const { randomBytes, randomBase64, randomBase64URL, randomHex, randomString } = require('../utils/crypto-helpers');
const CHARSETS = require('../utils/charset');
const crypto = require('crypto');

/**
 * JWT Secret Generators
 */
const jwt = {
    /**
     * Generate a JWT access token secret
     * @param {Object} options
     * @param {number} options.length - Length in bytes (default: 64)
     * @param {string} options.encoding - 'base64' | 'hex' | 'base64url' (default: 'base64')
     * @returns {string}
     */
    accessSecret(options = {}) {
        const { length = 64, encoding = 'base64' } = options;
        switch (encoding) {
            case 'hex': return randomHex(length);
            case 'base64url': return randomBase64URL(length);
            case 'base64':
            default: return randomBase64(length);
        }
    },

    /**
     * Generate a JWT refresh token secret
     * @param {Object} options
     * @param {number} options.length - Length in bytes (default: 128)
     * @param {string} options.encoding - 'base64' | 'hex' | 'base64url' (default: 'base64')
     * @returns {string}
     */
    refreshSecret(options = {}) {
        const { length = 128, encoding = 'base64' } = options;
        switch (encoding) {
            case 'hex': return randomHex(length);
            case 'base64url': return randomBase64URL(length);
            case 'base64':
            default: return randomBase64(length);
        }
    },

    /**
     * Generate an RSA key pair for JWT RS256/RS384/RS512
     * @param {Object} options
     * @param {number} options.modulusLength - Key size (default: 2048)
     * @returns {Object} { publicKey, privateKey }
     */
    rsaKeyPair(options = {}) {
        const { modulusLength = 2048 } = options;
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        return { publicKey, privateKey };
    },

    /**
     * Generate an EC key pair for JWT ES256/ES384/ES512
     * @param {Object} options
     * @param {string} options.namedCurve - 'P-256' | 'P-384' | 'P-521' (default: 'P-256')
     * @returns {Object} { publicKey, privateKey }
     */
    ecKeyPair(options = {}) {
        const { namedCurve = 'P-256' } = options;
        const curveMap = {
            'P-256': 'prime256v1',
            'P-384': 'secp384r1',
            'P-521': 'secp521r1',
        };
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
            namedCurve: curveMap[namedCurve] || namedCurve,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        return { publicKey, privateKey };
    },

    /**
     * Generate an Ed25519 key pair for JWT EdDSA
     * @returns {Object} { publicKey, privateKey }
     */
    ed25519KeyPair() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519', {
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        return { publicKey, privateKey };
    },

    /**
     * Generate a complete JWT secret set (access + refresh + key pair)
     * @returns {Object}
     */
    fullSet() {
        return {
            accessTokenSecret: jwt.accessSecret(),
            refreshTokenSecret: jwt.refreshSecret(),
            rsaKeyPair: jwt.rsaKeyPair(),
            createdAt: new Date().toISOString(),
        };
    },
};

module.exports = jwt;