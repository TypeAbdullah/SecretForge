const crypto = require('crypto');
const { randomHex, randomBase64, randomBase64URL } = require('../utils/crypto-helpers');

/**
 * Encryption Key & IV Generators
 */
const encryption = {
    /**
     * Generate an AES encryption key
     * @param {Object} options
     * @param {number} options.bits - Key size: 128, 192, or 256 (default: 256)
     * @param {string} options.encoding - 'hex' | 'base64' (default: 'hex')
     * @returns {string}
     */
    aesKey(options = {}) {
        const { bits = 256, encoding = 'hex' } = options;
        const validBits = [128, 192, 256];
        if (!validBits.includes(bits)) {
            throw new Error(`Invalid AES key size. Must be one of: ${validBits.join(', ')}`);
        }
        const bytes = crypto.randomBytes(bits / 8);
        return encoding === 'base64' ? bytes.toString('base64') : bytes.toString('hex');
    },

    /**
     * Generate an initialization vector (IV)
     * @param {Object} options
     * @param {number} options.length - IV length in bytes (default: 16 for AES)
     * @param {string} options.encoding - 'hex' | 'base64' (default: 'hex')
     * @returns {string}
     */
    iv(options = {}) {
        const { length = 16, encoding = 'hex' } = options;
        const bytes = crypto.randomBytes(length);
        return encoding === 'base64' ? bytes.toString('base64') : bytes.toString('hex');
    },

    /**
     * Generate an AES key + IV pair ready for encryption
     * @param {Object} options
     * @param {number} options.bits - AES key size (default: 256)
     * @returns {Object} { key, iv, algorithm }
     */
    aesKeyWithIV(options = {}) {
        const { bits = 256 } = options;
        return {
            key: encryption.aesKey({ bits }),
            iv: encryption.iv(),
            algorithm: `aes-${bits}-cbc`,
        };
    },

    /**
     * Generate an HMAC key
     * @param {Object} options
     * @param {number} options.length - Key length in bytes (default: 64)
     * @param {string} options.encoding - 'hex' | 'base64' (default: 'hex')
     * @returns {string}
     */
    hmacKey(options = {}) {
        const { length = 64, encoding = 'hex' } = options;
        const bytes = crypto.randomBytes(length);
        return encoding === 'base64' ? bytes.toString('base64') : bytes.toString('hex');
    },

    /**
     * Generate an RSA key pair
     * @param {Object} options
     * @param {number} options.modulusLength - Key size (default: 4096)
     * @param {string} options.passphrase - Optional passphrase for private key
     * @returns {Object} { publicKey, privateKey }
     */
    rsaKeyPair(options = {}) {
        const { modulusLength = 4096, passphrase = null } = options;
        const keyOptions = {
            modulusLength,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
                ...(passphrase ? { cipher: 'aes-256-cbc', passphrase } : {}),
            },
        };
        return crypto.generateKeyPairSync('rsa', keyOptions);
    },

    /**
     * Generate a Diffie-Hellman key pair
     * @param {Object} options
     * @param {number} options.primeLength - Prime length (default: 2048)
     * @returns {Object}
     */
    dhKeyPair(options = {}) {
        const { primeLength = 2048 } = options;
        const dh = crypto.createDiffieHellman(primeLength);
        dh.generateKeys();
        return {
            publicKey: dh.getPublicKey('hex'),
            privateKey: dh.getPrivateKey('hex'),
            prime: dh.getPrime('hex'),
            generator: dh.getGenerator('hex'),
        };
    },

    /**
     * Generate a salt
     * @param {Object} options
     * @param {number} options.length - Salt length in bytes (default: 32)
     * @param {string} options.encoding - 'hex' | 'base64' (default: 'hex')
     * @returns {string}
     */
    salt(options = {}) {
        const { length = 32, encoding = 'hex' } = options;
        const bytes = crypto.randomBytes(length);
        return encoding === 'base64' ? bytes.toString('base64') : bytes.toString('hex');
    },

    /**
     * Generate a nonce
     * @param {Object} options
     * @param {number} options.length - Nonce length in bytes (default: 24)
     * @returns {string}
     */
    nonce(options = {}) {
        const { length = 24 } = options;
        return randomHex(length);
    },

    /**
     * Derive a key from a password using scrypt
     * @param {string} password
     * @param {Object} options
     * @param {number} options.keyLength - Derived key length (default: 32)
     * @param {number} options.cost - CPU/memory cost (default: 16384)
     * @returns {Object} { derivedKey, salt }
     */
    deriveKey(password, options = {}) {
        const { keyLength = 32, cost = 16384 } = options;
        const saltBuffer = crypto.randomBytes(32);
        const derivedKey = crypto.scryptSync(password, saltBuffer, keyLength, { N: cost });
        return {
            derivedKey: derivedKey.toString('hex'),
            salt: saltBuffer.toString('hex'),
            cost,
            keyLength,
        };
    },
};

module.exports = encryption;