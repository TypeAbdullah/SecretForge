'use strict';

const jwt = require('./src/generators/jwt');
const cron = require('./src/generators/cron');
const api = require('./src/generators/api');
const password = require('./src/generators/password');
const database = require('./src/generators/database');
const encryption = require('./src/generators/encryption');
const oauth = require('./src/generators/oauth');
const webhook = require('./src/generators/webhook');
const session = require('./src/generators/session');
const uuid = require('./src/generators/uuid');
const core = require('./src/core');
const CHARSETS = require('./src/utils/charset');

/**
 * SecretForge - Generate all types of secrets easily
 */
const SecretForge = {
    // ─── Core ──────────────────────────────
    ...core,

    // ─── JWT ───────────────────────────────
    jwt,

    // ─── Cron ──────────────────────────────
    cron,

    // ─── API ───────────────────────────────
    api,

    // ─── Password ──────────────────────────
    password,

    // ─── Database ──────────────────────────
    database,
    db: database, // alias

    // ─── Encryption ────────────────────────
    encryption,
    crypto: encryption, // alias

    // ─── OAuth ─────────────────────────────
    oauth,

    // ─── Webhook ───────────────────────────
    webhook,

    // ─── Session ───────────────────────────
    session,

    // ─── UUID ──────────────────────────────
    uuid,
    id: uuid, // alias

    // ─── Character Sets ────────────────────
    CHARSETS,

    // ─── Quick Helpers ─────────────────────

    /**
     * Quick generate any type of secret
     * @param {string} type - Type of secret
     * @param {Object} options - Options
     * @returns {string|Object}
     */
    generate(type, options = {}) {
        const generators = {
            // JWT
            'jwt': () => jwt.accessSecret(options),
            'jwt:access': () => jwt.accessSecret(options),
            'jwt:refresh': () => jwt.refreshSecret(options),
            'jwt:rsa': () => jwt.rsaKeyPair(options),
            'jwt:ec': () => jwt.ecKeyPair(options),
            'jwt:ed25519': () => jwt.ed25519KeyPair(),
            'jwt:full': () => jwt.fullSet(),

            // Cron
            'cron': () => cron.secret(options),
            'cron:token': () => cron.authToken(options),
            'cron:signed': () => cron.signedToken(options),
            'cron:job': () => cron.jobKey(options),

            // API
            'api': () => api.key(options),
            'api:key': () => api.key(options),
            'api:prefixed': () => api.prefixedKey(options),
            'api:pair': () => api.keyPair(options),
            'api:bearer': () => api.bearerToken(options),
            'api:graphql': () => api.graphqlKey(options),
            'api:rest': () => api.restApiKey(options),

            // Password
            'password': () => password.generate(options),
            'passphrase': () => password.passphrase(options),
            'pin': () => password.pin(options),

            // Database
            'db:password': () => database.password(options),
            'db:mongo': () => database.mongoCredentials(options),
            'db:postgres': () => database.postgresCredentials(options),
            'db:mysql': () => database.mysqlCredentials(options),
            'db:redis': () => database.redisPassword(options),
            'db:key': () => database.encryptionKey(options),

            // Encryption
            'aes': () => encryption.aesKey(options),
            'aes:pair': () => encryption.aesKeyWithIV(options),
            'iv': () => encryption.iv(options),
            'hmac': () => encryption.hmacKey(options),
            'rsa': () => encryption.rsaKeyPair(options),
            'dh': () => encryption.dhKeyPair(options),
            'salt': () => encryption.salt(options),
            'nonce': () => encryption.nonce(options),

            // OAuth
            'oauth:client': () => oauth.clientCredentials(options),
            'oauth:id': () => oauth.clientId(options),
            'oauth:secret': () => oauth.clientSecret(options),
            'oauth:pkce': () => oauth.codeChallenge(),
            'oauth:code': () => oauth.authorizationCode(options),
            'oauth:state': () => oauth.state(options),

            // Webhook
            'webhook': () => webhook.secret(options),
            'webhook:token': () => webhook.verificationToken(options),
            'webhook:config': () => webhook.config(options),

            // Session
            'session': () => session.secret(options),
            'session:id': () => session.id(options),
            'session:cookie': () => session.cookieSecret(options),
            'session:csrf': () => session.csrfToken(options),
            'session:express': () => session.expressConfig(),

            // UUID
            'uuid': () => uuid.v4(),
            'uuid:short': () => uuid.short(options),
            'uuid:nano': () => uuid.nano(options),
            'uuid:sortable': () => uuid.sortable(),
            'uuid:cuid': () => uuid.cuid(),
            'uuid:objectid': () => uuid.objectId(),

            // Core
            'secret': () => core.secret(options),
            'hex': () => core.hex(options.length || 32),
            'base64': () => core.base64(options.length || 32),
            'base64url': () => core.base64url(options.length || 32),
            'dotenv': () => core.dotenv(options),
            'env': () => core.dotenv(options),
        };

        const generator = generators[type];
        if (!generator) {
            const available = Object.keys(generators).join(', ');
            throw new Error(`Unknown secret type: "${type}". Available types: ${available}`);
        }

        return generator();
    },

    /**
     * List all available secret types
     * @returns {Object}
     */
    types() {
        return {
            jwt: ['jwt', 'jwt:access', 'jwt:refresh', 'jwt:rsa', 'jwt:ec', 'jwt:ed25519', 'jwt:full'],
            cron: ['cron', 'cron:token', 'cron:signed', 'cron:job'],
            api: ['api', 'api:key', 'api:prefixed', 'api:pair', 'api:bearer', 'api:graphql', 'api:rest'],
            password: ['password', 'passphrase', 'pin'],
            database: ['db:password', 'db:mongo', 'db:postgres', 'db:mysql', 'db:redis', 'db:key'],
            encryption: ['aes', 'aes:pair', 'iv', 'hmac', 'rsa', 'dh', 'salt', 'nonce'],
            oauth: ['oauth:client', 'oauth:id', 'oauth:secret', 'oauth:pkce', 'oauth:code', 'oauth:state'],
            webhook: ['webhook', 'webhook:token', 'webhook:config'],
            session: ['session', 'session:id', 'session:cookie', 'session:csrf', 'session:express'],
            uuid: ['uuid', 'uuid:short', 'uuid:nano', 'uuid:sortable', 'uuid:cuid', 'uuid:objectid'],
            core: ['secret', 'hex', 'base64', 'base64url', 'dotenv', 'env'],
        };
    },

    /**
     * Version
     */
    version: '1.0.0',
};

module.exports = SecretForge;