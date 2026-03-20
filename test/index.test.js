'use strict';

const forge = require('../index');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✅ ${message}`);
        passed++;
    } else {
        console.error(`  ❌ ${message}`);
        failed++;
    }
}

function section(name) {
    console.log(`\n━━━ ${name} ━━━`);
}

// ═══════════════════════════════════════
// Tests
// ═══════════════════════════════════════

section('Core');
assert(typeof forge.secret() === 'string', 'secret() returns a string');
assert(forge.hex(16).length === 32, 'hex(16) returns 32 chars');
assert(typeof forge.base64(32) === 'string', 'base64() returns a string');
assert(typeof forge.base64url(32) === 'string', 'base64url() returns a string');
assert(Buffer.isBuffer(forge.bytes(32)), 'bytes() returns a Buffer');
assert(forge.bytes(32).length === 32, 'bytes(32) returns 32 bytes');

section('JWT');
assert(typeof forge.jwt.accessSecret() === 'string', 'jwt.accessSecret() returns a string');
assert(typeof forge.jwt.refreshSecret() === 'string', 'jwt.refreshSecret() returns a string');
assert(forge.jwt.accessSecret().length > 0, 'jwt.accessSecret() is not empty');
assert(forge.jwt.refreshSecret().length > forge.jwt.accessSecret().length, 'refresh secret is longer than access');

const rsaKeys = forge.jwt.rsaKeyPair();
assert(rsaKeys.publicKey.includes('BEGIN PUBLIC KEY'), 'RSA public key is PEM format');
assert(rsaKeys.privateKey.includes('BEGIN PRIVATE KEY'), 'RSA private key is PEM format');

const ecKeys = forge.jwt.ecKeyPair();
assert(ecKeys.publicKey.includes('BEGIN PUBLIC KEY'), 'EC public key is PEM format');
assert(ecKeys.privateKey.includes('BEGIN PRIVATE KEY'), 'EC private key is PEM format');

const edKeys = forge.jwt.ed25519KeyPair();
assert(edKeys.publicKey.includes('BEGIN PUBLIC KEY'), 'Ed25519 public key is PEM format');

const fullSet = forge.jwt.fullSet();
assert(typeof fullSet.accessTokenSecret === 'string', 'fullSet has accessTokenSecret');
assert(typeof fullSet.refreshTokenSecret === 'string', 'fullSet has refreshTokenSecret');
assert(fullSet.rsaKeyPair !== undefined, 'fullSet has rsaKeyPair');

section('Cron');
assert(forge.cron.secret().startsWith('cron_'), 'cron.secret() has cron_ prefix');
assert(typeof forge.cron.authToken() === 'string', 'cron.authToken() returns a string');
const signedToken = forge.cron.signedToken();
assert(signedToken.signature !== undefined, 'cron.signedToken() has signature');
assert(signedToken.timestamp !== undefined, 'cron.signedToken() has timestamp');
const jobKey = forge.cron.jobKey({ jobName: 'test-job' });
assert(jobKey.jobName === 'test-job', 'cron.jobKey() has correct jobName');

section('API');
assert(typeof forge.api.key() === 'string', 'api.key() returns a string');
assert(forge.api.key({ prefix: 'test' }).startsWith('test_'), 'api.key() with prefix works');
assert(forge.api.prefixedKey().includes('sk_live_'), 'api.prefixedKey() has correct format');
const keyPair = forge.api.keyPair();
assert(keyPair.publicKey.includes('_pk_'), 'keyPair has public key');
assert(keyPair.secretKey.includes('_sk_'), 'keyPair has secret key');
assert(typeof forge.api.bearerToken() === 'string', 'api.bearerToken() works');
assert(forge.api.graphqlKey().startsWith('gql_'), 'api.graphqlKey() has prefix');

section('Password');
const pwd = forge.password.generate({ length: 32 });
assert(pwd.length === 32, 'password.generate() respects length');
assert(typeof forge.password.passphrase() === 'string', 'passphrase() works');
const pin = forge.password.pin({ length: 4 });
assert(pin.length === 4, 'pin() respects length');
assert(/^\d+$/.test(pin), 'pin() contains only digits');
const hashResult = forge.password.hash('test123');
assert(hashResult.hash !== undefined, 'password.hash() returns hash');
assert(hashResult.salt !== undefined, 'password.hash() returns salt');

section('Database');
assert(typeof forge.database.password() === 'string', 'database.password() works');
const mongoCreds = forge.database.mongoCredentials();
assert(mongoCreds.connectionString.startsWith('mongodb://'), 'mongoCreds has connection string');
const pgCreds = forge.database.postgresCredentials();
assert(pgCreds.connectionString.startsWith('postgresql://'), 'pgCreds has connection string');
const mysqlCreds = forge.database.mysqlCredentials();
assert(mysqlCreds.connectionString.startsWith('mysql://'), 'mysqlCreds has connection string');
assert(typeof forge.database.redisPassword() === 'string', 'redisPassword() works');
assert(forge.db === forge.database, 'db alias works');

section('Encryption');
assert(forge.encryption.aesKey({ bits: 256 }).length === 64, 'AES-256 key is 64 hex chars');
assert(forge.encryption.aesKey({ bits: 128 }).length === 32, 'AES-128 key is 32 hex chars');
assert(forge.encryption.iv().length === 32, 'IV is 32 hex chars (16 bytes)');
const aesPair = forge.encryption.aesKeyWithIV();
assert(aesPair.key !== undefined, 'aesKeyWithIV has key');
assert(aesPair.iv !== undefined, 'aesKeyWithIV has iv');
assert(aesPair.algorithm.startsWith('aes-'), 'aesKeyWithIV has algorithm');
assert(typeof forge.encryption.hmacKey() === 'string', 'hmacKey() works');
assert(typeof forge.encryption.salt() === 'string', 'salt() works');
assert(typeof forge.encryption.nonce() === 'string', 'nonce() works');

section('OAuth');
assert(typeof forge.oauth.clientId() === 'string', 'oauth.clientId() works');
assert(typeof forge.oauth.clientSecret() === 'string', 'oauth.clientSecret() works');
const clientCreds = forge.oauth.clientCredentials();
assert(clientCreds.clientId !== undefined, 'clientCredentials has clientId');
assert(clientCreds.clientSecret !== undefined, 'clientCredentials has clientSecret');
const pkce = forge.oauth.codeChallenge();
assert(pkce.codeVerifier !== undefined, 'PKCE has codeVerifier');
assert(pkce.codeChallenge !== undefined, 'PKCE has codeChallenge');
assert(pkce.method === 'S256', 'PKCE method is S256');
assert(typeof forge.oauth.state() === 'string', 'oauth.state() works');

section('Webhook');
assert(forge.webhook.secret().startsWith('whsec_'), 'webhook.secret() has prefix');
assert(typeof forge.webhook.verificationToken() === 'string', 'webhook.verificationToken() works');
const webhookConfig = forge.webhook.config({ service: 'stripe' });
assert(webhookConfig.service === 'stripe', 'webhook.config() has service');
assert(webhookConfig.signingSecret !== undefined, 'webhook.config() has signingSecret');

const signed = forge.webhook.sign({ event: 'test' }, 'my-secret');
assert(signed.signature.startsWith('sha256='), 'webhook.sign() signature has prefix');
assert(signed.timestamp !== undefined, 'webhook.sign() has timestamp');

section('Session');
assert(typeof forge.session.secret() === 'string', 'session.secret() works');
assert(forge.session.id().startsWith('sess_'), 'session.id() has prefix');
assert(typeof forge.session.cookieSecret() === 'string', 'session.cookieSecret() works');
assert(typeof forge.session.csrfToken() === 'string', 'session.csrfToken() works');
const rotation = forge.session.rotationSecrets({ count: 5 });
assert(rotation.length === 5, 'rotationSecrets() returns correct count');
const expressConf = forge.session.expressConfig();
assert(expressConf.sessionSecret !== undefined, 'expressConfig has sessionSecret');

section('UUID');
const uuidv4 = forge.uuid.v4();
assert(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuidv4), 'uuid.v4() is valid');
assert(forge.uuid.batch(3).length === 3, 'uuid.batch() returns correct count');
assert(forge.uuid.short().length === 12, 'uuid.short() default length is 12');
assert(forge.uuid.nano().length === 21, 'uuid.nano() default length is 21');
assert(typeof forge.uuid.sortable() === 'string', 'uuid.sortable() works');
assert(forge.uuid.cuid().startsWith('c'), 'uuid.cuid() starts with c');
assert(forge.uuid.objectId().length === 24, 'uuid.objectId() is 24 chars');
assert(forge.id === forge.uuid, 'id alias works');

section('.generate() Universal Method');
assert(typeof forge.generate('jwt') === 'string', 'generate("jwt") works');
assert(typeof forge.generate('password') === 'string', 'generate("password") works');
assert(typeof forge.generate('uuid') === 'string', 'generate("uuid") works');
assert(typeof forge.generate('webhook') === 'string', 'generate("webhook") works');
assert(typeof forge.generate('cron') === 'string', 'generate("cron") works');

try {
    forge.generate('invalid_type');
    assert(false, 'generate() throws for invalid type');
} catch (e) {
    assert(true, 'generate() throws for invalid type');
}

section('.dotenv() Generator');
const envContent = forge.dotenv({ appName: 'TestApp' });
assert(envContent.includes('TESTAPP_JWT_ACCESS_SECRET='), 'dotenv has JWT access secret');
assert(envContent.includes('TESTAPP_SESSION_SECRET='), 'dotenv has session secret');
assert(envContent.includes('TESTAPP_DB_PASSWORD='), 'dotenv has DB password');

section('Secret Analysis');
const analysis = forge.analyze('MyP@ssw0rd!2024');
assert(analysis.length === 15, 'analyze reports correct length');
assert(analysis.composition.lowercase === true, 'analyze detects lowercase');
assert(analysis.composition.uppercase === true, 'analyze detects uppercase');
assert(analysis.composition.digits === true, 'analyze detects digits');
assert(analysis.composition.symbols === true, 'analyze detects symbols');
assert(analysis.strength !== undefined, 'analyze reports strength');

section('Types List');
const types = forge.types();
assert(Object.keys(types).length > 0, 'types() returns categories');
assert(Array.isArray(types.jwt), 'types() has jwt category');

// ═══════════════════════════════════════
// Summary
// ═══════════════════════════════════════
console.log('\n═══════════════════════════════════════');
console.log(`  Total:  ${passed + failed}`);
console.log(`  Passed: ${passed} ✅`);
console.log(`  Failed: ${failed} ❌`);
console.log('═══════════════════════════════════════\n');

process.exit(failed > 0 ? 1 : 0);