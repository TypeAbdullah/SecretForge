#!/usr/bin/env node

'use strict';

const forge = require('../index');

const args = process.argv.slice(2);
const command = args[0];
const options = {};

// Parse CLI arguments
for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
        const key = arg.slice(2);
        const value = args[i + 1];
        if (value && !value.startsWith('--')) {
            // Try to parse numbers
            options[key] = isNaN(value) ? value : Number(value);
            i++;
        } else {
            options[key] = true;
        }
    }
}

// Help text
const helpText = `
╔═══════════════════════════════════════════════════╗
║            🔐 SecretForge CLI v1.0.0              ║
║     Generate all types of secrets instantly        ║
╚═══════════════════════════════════════════════════╝

USAGE:
  secretforge <type> [options]

TYPES:
  ─── JWT ─────────────────────────────────────────
  jwt               JWT access token secret
  jwt:refresh       JWT refresh token secret
  jwt:rsa           RSA key pair for JWT
  jwt:ec            EC key pair for JWT
  jwt:ed25519       Ed25519 key pair for JWT
  jwt:full          Complete JWT secret set

  ─── Cron ────────────────────────────────────────
  cron              Cron job secret
  cron:token        Cron auth token
  cron:signed       Signed cron token
  cron:job          Cron job API key

  ─── API ─────────────────────────────────────────
  api               API key
  api:prefixed      Prefixed API key (like Stripe)
  api:pair          API key pair (public + secret)
  api:bearer        Bearer token
  api:graphql       GraphQL API key
  api:rest          REST API key with metadata

  ─── Password ────────────────────────────────────
  password          Strong random password
  passphrase        Memorable passphrase
  pin               Numeric PIN

  ─── Database ────────────────────────────────────
  db:password       Database password
  db:mongo          MongoDB credentials
  db:postgres       PostgreSQL credentials
  db:mysql          MySQL credentials
  db:redis          Redis password
  db:key            Database encryption key

  ─── Encryption ──────────────────────────────────
  aes               AES encryption key
  aes:pair          AES key + IV pair
  iv                Initialization vector
  hmac              HMAC key
  rsa               RSA key pair
  salt              Random salt
  nonce             Random nonce

  ─── OAuth ───────────────────────────────────────
  oauth:client      OAuth client credentials
  oauth:pkce        PKCE code verifier + challenge
  oauth:code        Authorization code
  oauth:state       OAuth state parameter

  ─── Webhook ─────────────────────────────────────
  webhook           Webhook signing secret
  webhook:token     Webhook verification token
  webhook:config    Complete webhook configuration

  ─── Session ─────────────────────────────────────
  session           Session secret
  session:id        Session ID
  session:cookie    Cookie signing secret
  session:csrf      CSRF token
  session:express   Express session configuration

  ─── UUID ────────────────────────────────────────
  uuid              UUID v4
  uuid:short        Short unique ID
  uuid:nano         Nano ID
  uuid:sortable     Sortable unique ID
  uuid:cuid         CUID-like ID
  uuid:objectid     MongoDB ObjectId-like

  ─── Core ────────────────────────────────────────
  secret            Generic secret
  hex               Hex string
  base64            Base64 string
  base64url         URL-safe base64 string
  dotenv            Complete .env file content
  analyze           Analyze a secret's strength

OPTIONS:
  --length <n>      Length (bytes or chars depending on type)
  --encoding <enc>  Encoding: hex, base64, base64url
  --prefix <str>    Prefix for keys
  --bits <n>        Key size in bits (for encryption)
  --count <n>       Number of items to generate
  --appName <str>   App name (for dotenv)
  --help            Show this help message

EXAMPLES:
  secretforge jwt
  secretforge jwt:refresh --length 256
  secretforge password --length 32 --symbols
  secretforge passphrase --words 6
  secretforge api:prefixed --prefix sk --environment live
  secretforge dotenv --appName MyApp
  secretforge db:postgres --host db.example.com
  secretforge aes --bits 256
  secretforge uuid --count 5
  secretforge analyze --secret "your-secret-here"
`;

if (!command || command === '--help' || command === '-h' || command === 'help') {
    console.log(helpText);
    process.exit(0);
}

// Special case: analyze
if (command === 'analyze') {
    const secret = options.secret || args[1];
    if (!secret) {
        console.error('❌ Please provide a secret to analyze: secretforge analyze --secret "your-secret"');
        process.exit(1);
    }
    const result = forge.analyze(secret);
    console.log('\n🔍 Secret Analysis:');
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
}

// Special case: batch UUIDs
if (command === 'uuid' && options.count) {
    const uuids = forge.uuid.batch(options.count);
    uuids.forEach((id, i) => console.log(`  ${i + 1}. ${id}`));
    process.exit(0);
}

try {
    const result = forge.generate(command, options);

    console.log('');
    if (typeof result === 'string') {
        console.log(`🔐 ${command}:`);
        console.log(`   ${result}`);
    } else {
        console.log(`🔐 ${command}:`);
        console.log(JSON.stringify(result, null, 2));
    }
    console.log('');
} catch (err) {
    console.error(`\n❌ Error: ${err.message}\n`);
    console.error('Run "secretforge --help" to see available types.\n');
    process.exit(1);
}