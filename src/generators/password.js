const { randomString, randomBytes } = require('../utils/crypto-helpers');
const CHARSETS = require('../utils/charset');
const crypto = require('crypto');

/**
 * Password & Passphrase Generators
 */
const password = {
    /**
     * Generate a strong random password
     * @param {Object} options
     * @param {number} options.length - Length (default: 24)
     * @param {boolean} options.uppercase - Include uppercase (default: true)
     * @param {boolean} options.lowercase - Include lowercase (default: true)
     * @param {boolean} options.digits - Include digits (default: true)
     * @param {boolean} options.symbols - Include symbols (default: true)
     * @param {string} options.exclude - Characters to exclude (default: '')
     * @returns {string}
     */
    generate(options = {}) {
        const {
            length = 24,
            uppercase = true,
            lowercase = true,
            digits = true,
            symbols = true,
            exclude = '',
        } = options;

        let charset = '';
        const required = [];

        if (lowercase) {
            charset += CHARSETS.LOWERCASE;
            required.push(CHARSETS.LOWERCASE);
        }
        if (uppercase) {
            charset += CHARSETS.UPPERCASE;
            required.push(CHARSETS.UPPERCASE);
        }
        if (digits) {
            charset += CHARSETS.DIGITS;
            required.push(CHARSETS.DIGITS);
        }
        if (symbols) {
            charset += CHARSETS.SYMBOLS_SAFE;
            required.push(CHARSETS.SYMBOLS_SAFE);
        }

        // Remove excluded characters
        if (exclude) {
            charset = charset.split('').filter(c => !exclude.includes(c)).join('');
        }

        if (!charset) {
            throw new Error('At least one character set must be enabled');
        }

        // Generate password ensuring at least one char from each required set
        let result;
        let attempts = 0;
        do {
            result = randomString(length, charset);
            attempts++;
        } while (
            !required.every(req => {
                const filtered = req.split('').filter(c => !exclude.includes(c));
                return filtered.length === 0 || filtered.some(c => result.includes(c));
            }) && attempts < 100
        );

        return result;
    },

    /**
     * Generate a memorable passphrase
     * @param {Object} options
     * @param {number} options.words - Number of words (default: 5)
     * @param {string} options.separator - Word separator (default: '-')
     * @param {boolean} options.capitalize - Capitalize words (default: true)
     * @param {boolean} options.includeNumber - Add a number (default: true)
     * @returns {string}
     */
    passphrase(options = {}) {
        const {
            words = 5,
            separator = '-',
            capitalize = true,
            includeNumber = true,
        } = options;

        // Word list (EFF short word list subset - expanded)
        const wordList = [
            'acorn', 'blade', 'cloud', 'delta', 'eagle', 'flame', 'grape', 'honey',
            'ivory', 'jewel', 'knack', 'lemon', 'mango', 'noble', 'ocean', 'pearl',
            'quilt', 'river', 'storm', 'tiger', 'unity', 'vivid', 'whale', 'xenon',
            'yacht', 'zebra', 'amber', 'birch', 'coral', 'drift', 'ember', 'frost',
            'gleam', 'haven', 'inlet', 'junco', 'karma', 'lunar', 'maple', 'nexus',
            'orbit', 'prism', 'quest', 'realm', 'solar', 'thorn', 'ultra', 'vapor',
            'wrist', 'pixel', 'crane', 'flint', 'grove', 'haste', 'index', 'joust',
            'kneel', 'logic', 'merit', 'nerve', 'oasis', 'plumb', 'ranch', 'scout',
            'trace', 'usher', 'vault', 'waltz', 'yield', 'blaze', 'cider', 'dwarf',
            'epoch', 'forge', 'glyph', 'hatch', 'irony', 'jazzy', 'knack', 'lyric',
            'mocha', 'niece', 'optic', 'plume', 'quota', 'ridge', 'snare', 'twine',
            'urban', 'vigor', 'woven', 'onyx', 'youth', 'zonal', 'apex', 'brine',
            'chess', 'denim', 'elbow', 'fjord', 'ghost', 'hedge', 'ivory', 'jolly',
        ];

        const bytes = randomBytes(words);
        const selectedWords = [];

        for (let i = 0; i < words; i++) {
            const idx = bytes[i] % wordList.length;
            let word = wordList[idx];
            if (capitalize) {
                word = word.charAt(0).toUpperCase() + word.slice(1);
            }
            selectedWords.push(word);
        }

        if (includeNumber) {
            const numBytes = randomBytes(2);
            const num = ((numBytes[0] << 8) | numBytes[1]) % 1000;
            selectedWords.push(num.toString());
        }

        return selectedWords.join(separator);
    },

    /**
     * Generate a PIN
     * @param {Object} options
     * @param {number} options.length - PIN length (default: 6)
     * @returns {string}
     */
    pin(options = {}) {
        const { length = 6 } = options;
        return randomString(length, CHARSETS.DIGITS);
    },

    /**
     * Hash a password using PBKDF2
     * @param {string} pwd - Password to hash
     * @param {Object} options
     * @param {number} options.iterations - Iterations (default: 100000)
     * @param {number} options.keyLength - Key length (default: 64)
     * @param {string} options.digest - Digest algorithm (default: 'sha512')
     * @returns {Object} { hash, salt, iterations, digest }
     */
    hash(pwd, options = {}) {
        const {
            iterations = 100000,
            keyLength = 64,
            digest = 'sha512',
        } = options;

        const salt = crypto.randomBytes(32).toString('hex');
        const derivedKey = crypto.pbkdf2Sync(pwd, salt, iterations, keyLength, digest);

        return {
            hash: derivedKey.toString('hex'),
            salt,
            iterations,
            digest,
            combined: `${digest}:${iterations}:${salt}:${derivedKey.toString('hex')}`,
        };
    },
};

module.exports = password;