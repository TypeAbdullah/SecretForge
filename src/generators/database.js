const { randomString, randomHex } = require('../utils/crypto-helpers');
const CHARSETS = require('../utils/charset');

/**
 * Database Secret Generators
 */
const database = {
    /**
     * Generate a database password
     * @param {Object} options
     * @param {number} options.length - Length (default: 32)
     * @param {boolean} options.safe - Use DB-safe characters only (default: true)
     * @returns {string}
     */
    password(options = {}) {
        const { length = 32, safe = true } = options;
        const charset = safe
            ? CHARSETS.ALPHANUMERIC + '!@#$%^&*'
            : CHARSETS.ALL;
        return randomString(length, charset);
    },

    /**
     * Generate a MongoDB connection string with random credentials
     * @param {Object} options
     * @returns {Object}
     */
    mongoCredentials(options = {}) {
        const {
            host = 'localhost',
            port = 27017,
            dbName = 'mydb',
            usernameLength = 12,
            passwordLength = 32,
        } = options;

        const username = 'user_' + randomString(usernameLength, CHARSETS.LOWERCASE + CHARSETS.DIGITS);
        const pwd = randomString(passwordLength, CHARSETS.ALPHANUMERIC + '!@#$%^&*');

        return {
            username,
            password: pwd,
            connectionString: `mongodb://${username}:${encodeURIComponent(pwd)}@${host}:${port}/${dbName}`,
            host,
            port,
            dbName,
        };
    },

    /**
     * Generate PostgreSQL credentials
     * @param {Object} options
     * @returns {Object}
     */
    postgresCredentials(options = {}) {
        const {
            host = 'localhost',
            port = 5432,
            dbName = 'mydb',
            passwordLength = 32,
        } = options;

        const username = 'pg_' + randomString(8, CHARSETS.LOWERCASE);
        const pwd = randomString(passwordLength, CHARSETS.ALPHANUMERIC);

        return {
            username,
            password: pwd,
            connectionString: `postgresql://${username}:${pwd}@${host}:${port}/${dbName}`,
            host,
            port,
            dbName,
        };
    },

    /**
     * Generate MySQL credentials
     * @param {Object} options
     * @returns {Object}
     */
    mysqlCredentials(options = {}) {
        const {
            host = 'localhost',
            port = 3306,
            dbName = 'mydb',
            passwordLength = 32,
        } = options;

        const username = 'mysql_' + randomString(8, CHARSETS.LOWERCASE);
        const pwd = randomString(passwordLength, CHARSETS.ALPHANUMERIC + '!@#$%');

        return {
            username,
            password: pwd,
            connectionString: `mysql://${username}:${encodeURIComponent(pwd)}@${host}:${port}/${dbName}`,
            host,
            port,
            dbName,
        };
    },

    /**
     * Generate a Redis password
     * @param {Object} options
     * @param {number} options.length - Length (default: 48)
     * @returns {string}
     */
    redisPassword(options = {}) {
        const { length = 48 } = options;
        return randomString(length, CHARSETS.ALPHANUMERIC);
    },

    /**
     * Generate a database encryption key
     * @param {Object} options
     * @param {number} options.bits - Key size in bits: 128, 192, or 256 (default: 256)
     * @returns {string}
     */
    encryptionKey(options = {}) {
        const { bits = 256 } = options;
        return randomHex(bits / 8);
    },
};

module.exports = database;