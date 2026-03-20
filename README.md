# 🔐 SecretForge

[![npm version](https://img.shields.io/npm/v/secretforge.svg?style=flat-square)](https://www.npmjs.com/package/secretforge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg?style=flat-square)](https://nodejs.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://github.com/TypeAbdullah/SecretForge/graphs/commit-activity)

> Generate **all types of secrets** instantly — JWT, API keys, passwords, cron, database, encryption, OAuth, webhooks, sessions, UUIDs & more.

**Zero dependencies** · Node.js 18+ · Cryptographically secure (`crypto.randomBytes`)

```bash
npm install secretforge
```

---

## 🚀 Quick Start

```javascript
const sf = require('secretforge');

// JWT
sf.jwt.accessSecret()                              // base64 JWT secret
sf.jwt.refreshSecret()                             // longer refresh secret
sf.jwt.rsaKeyPair()                                // { publicKey, privateKey }
sf.jwt.ecKeyPair({ namedCurve: 'P-384' })          // EC key pair
sf.jwt.ed25519KeyPair()                            // Ed25519 key pair
sf.jwt.fullSet()                                   // access + refresh + RSA

// API Keys
sf.api.key({ prefix: 'myapp' })                    // "myapp_x7Kj2mN8..."
sf.api.prefixedKey({ prefix:'sk', environment:'live' }) // "sk_live_..."
sf.api.keyPair()                                   // { publicKey, secretKey }
sf.api.bearerToken()                               // URL-safe bearer token
sf.api.graphqlKey()                                // "gql_..."
sf.api.restApiKey({ scopes:['read','write'] })     // key + metadata

// Passwords
sf.password.generate({ length: 32 })               // "k#9Lm$2nPq@4wR6t..."
sf.password.passphrase({ words: 5 })               // "Tiger-Maple-Storm-Ocean-427"
sf.password.pin({ length: 6 })                     // "847291"
sf.password.hash('mypass')                         // { hash, salt, combined }

// Cron
sf.cron.secret()                                   // "cron_x7Kj2mN8..."
sf.cron.signedToken({ validityMinutes: 10 })       // time-based signed token
sf.cron.jobKey({ jobName: 'cleanup' })             // { jobId, apiKey }

// Database
sf.database.password()                             // DB-safe password
sf.database.postgresCredentials()                  // { username, password, connectionString }
sf.database.mongoCredentials()                     // MongoDB connection string
sf.database.mysqlCredentials()                     // MySQL connection string
sf.database.redisPassword()                        // Redis password
sf.db.encryptionKey({ bits: 256 })                 // alias works too

// Encryption
sf.encryption.aesKey({ bits: 256 })                // AES-256 hex key
sf.encryption.aesKeyWithIV()                       // { key, iv, algorithm }
sf.encryption.hmacKey()                            // HMAC key
sf.encryption.rsaKeyPair({ modulusLength: 4096 })  // RSA-4096
sf.encryption.salt()                               // random salt
sf.encryption.nonce()                              // random nonce
sf.encryption.deriveKey('password')                // scrypt derivation
sf.crypto.aesKey()                                 // alias works too

// OAuth
sf.oauth.clientCredentials()                       // { clientId, clientSecret }
sf.oauth.codeChallenge()                           // PKCE { codeVerifier, codeChallenge }
sf.oauth.state()                                   // CSRF state param

// Webhook
sf.webhook.secret()                                // "whsec_..."
sf.webhook.sign(payload, secret)                   // { signature, timestamp, header }
sf.webhook.config({ service: 'stripe' })           // full webhook config

// Session
sf.session.secret()                                // session secret
sf.session.csrfToken()                             // CSRF token
sf.session.expressConfig()                         // complete Express config
sf.session.rotationSecrets({ count: 5 })           // rotation array

// UUID
sf.uuid.v4()                                       // UUID v4
sf.uuid.nano()                                     // 21-char nano ID
sf.uuid.short()                                    // 12-char short ID
sf.uuid.sortable()                                 // timestamp-sortable ID
sf.uuid.objectId()                                 // MongoDB ObjectId-like
sf.id.v4()                                         // alias works too

// Core
sf.hex(32)                                         // 64-char hex
sf.base64(32)                                      // base64 string
sf.base64url(32)                                   // URL-safe base64
sf.analyze('MyP@ssw0rd!')                          // { entropy, strength, ... }
```

---

## 🛠️ Universal Generator

Generate any secret type with a unified interface:

```javascript
sf.generate('jwt:refresh')
sf.generate('api:prefixed', { prefix: 'sk', environment: 'live' })
sf.generate('password', { length: 40 })
sf.generate('db:postgres', { dbName: 'prod' })
sf.generate('oauth:pkce')
sf.generate('dotenv', { appName: 'MyApp' })
```

**Supported Types:**
`jwt` `jwt:access` `jwt:refresh` `jwt:rsa` `jwt:ec` `jwt:ed25519` `jwt:full` · `cron` `cron:token` `cron:signed` `cron:job` · `api` `api:key` `api:prefixed` `api:pair` `api:bearer` `api:graphql` `api:rest` · `password` `passphrase` `pin` · `db:password` `db:mongo` `db:postgres` `db:mysql` `db:redis` `db:key` · `aes` `aes:pair` `iv` `hmac` `rsa` `dh` `salt` `nonce` · `oauth:client` `oauth:id` `oauth:secret` `oauth:pkce` `oauth:code` `oauth:state` · `webhook` `webhook:token` `webhook:config` · `session` `session:id` `session:cookie` `session:csrf` `session:express` · `uuid` `uuid:short` `uuid:nano` `uuid:sortable` `uuid:cuid` `uuid:objectid` · `secret` `hex` `base64` `base64url` `dotenv`

---

## 📄 .env Generator

Automatically generate a production-ready `.env` file with secure defaults:

```javascript
const fs = require('fs');
const sf = require('secretforge');

fs.writeFileSync('.env', sf.dotenv({ appName: 'MyApp' }));
// Generates complete .env with JWT, session, DB, API, encryption, webhook, and Redis secrets.
```

---

## 💻 CLI Usage

Install globally to use `secretforge` anywhere:

```bash
npm i -g secretforge

secretforge jwt
secretforge jwt:refresh --length 256
secretforge password --length 40
secretforge passphrase --words 6
secretforge api:prefixed --prefix sk --environment live
secretforge db:postgres --dbName production
secretforge oauth:pkce
secretforge uuid --count 10
secretforge dotenv --appName MyApp
secretforge analyze --secret "MyP@ssw0rd!"
secretforge --help
```

---

## 🔍 Strength Analyzer

Evaluate the entropy and strength of any secret:

```javascript
sf.analyze('abc123')              // { strength: "very-weak", entropy: "15 bits" }
sf.analyze(sf.jwt.accessSecret()) // { strength: "excellent", entropy: "524 bits" }
```

| Strength | Entropy |
| :--- | :--- |
| **Very Weak** | < 20 bits |
| **Weak** | 20–39 bits |
| **Moderate** | 40–59 bits |
| **Good** | 60–79 bits |
| **Strong** | 80–127 bits |
| **Excellent** | 128+ bits |

---

## 💡 Real-World Example

```javascript
const sf = require('secretforge');
const fs = require('fs');

const pg = sf.database.postgresCredentials({ dbName: 'app_prod' });
const redis = sf.database.redisPassword();

fs.writeFileSync('.env.production', `
NODE_ENV=production
JWT_ACCESS_SECRET=${sf.jwt.accessSecret({ encoding: 'base64url' })}
JWT_REFRESH_SECRET=${sf.jwt.refreshSecret({ encoding: 'base64url' })}
DATABASE_URL=${pg.connectionString}
REDIS_URL=redis://:${redis}@redis:6379
SESSION_SECRET=${sf.session.secret()}
ENCRYPTION_KEY=${sf.encryption.aesKey()}
WEBHOOK_SECRET=${sf.webhook.secret()}
CRON_SECRET=${sf.cron.secret()}
`.trim());
```

---

## 🛡️ Security

- ✅ **CSPRNG**: Uses `crypto.randomBytes()` for cryptographically secure randomness.
- ✅ **Zero Dependencies**: Lightweight and secure with no supply-chain risks.
- ✅ **Fully Offline**: All generation happens locally; nothing is ever sent over the wire.
- ✅ **Best Practices**: Industry-standard defaults for all secret types.

---

## 👤 Author

**TypeAbdullah**
- GitHub: [@TypeAbdullah](https://github.com/TypeAbdullah)

## 📄 License

MIT © [TypeAbdullah](https://github.com/TypeAbdullah)
