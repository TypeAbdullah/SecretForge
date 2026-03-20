# 🔐 SecretForge

[![npm version](https://img.shields.io/npm/v/secretforgejs.svg?style=flat-square)](https://www.npmjs.com/package/secretforgejs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg?style=flat-square)](https://nodejs.org/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=flat-square)](https://github.com/TypeAbdullah/SecretForge/graphs/commit-activity)

**SecretForge** is a powerful, lightweight, and versatile secret generation engine for modern developers. Whether you need a secure JWT secret, a complex API key, a memorable passphrase, or a complete `.env` template, SecretForge handles it all with precision and ease.

---

## ✨ Features

- 🛠️ **Universal Generator**: Generate JWTs, API keys, passwords, UUIDs, and more from a single tool.
- 💻 **CLI First**: Command-line interface for instant secret generation during development.
- 📦 **Library Ready**: Full-featured Node.js API for programmatic use in your applications.
- 🔒 **Security-Centric**: Uses cryptographically secure random number generators.
- 🚀 **Zero Dependencies**: Lightweight and fast with no external production dependencies.

---

## 🚀 Installation

### Using as a CLI Tool
Install globally to use `secretforge` anywhere in your terminal:
```bash
npm install -g secretforge
```

### Using as a Library
Add it to your project as a dependency:
```bash
npm install secretforge
```

---

## 🛠️ CLI Usage

Generate secrets instantly from your terminal:

```bash
# Generate a standard JWT access secret
secretforge jwt

# Generate a strong 32-character password
secretforge password --length 32

# Create a prefixed API key (e.g., sk_...)
secretforge api:prefixed --prefix sk

# Generate 5 batch UUIDs
secretforge uuid --count 5

# Generate a complete .env file template
secretforge dotenv --appName MyAwesomeApp
```

> [!TIP]
> Run `secretforge --help` to see the full list of over 50+ available secret types!

---

## 📦 Library Usage

Import SecretForge into your Node.js project:

```javascript
const forge = require('secretforge');

// Quick generation
const apiKey = forge.generate('api:key');
console.log(apiKey);

// Generate a JWT full set (Access + Refresh + RSA)
const jwtSecrets = forge.jwt.fullSet();
console.log(jwtSecrets);

// Create a memorable passphrase
const secretWords = forge.password.passphrase({ words: 5, separator: '-' });
console.log(secretWords);
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
