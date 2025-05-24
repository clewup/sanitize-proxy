# 🔒 sanitize-proxy

[![npm version](https://img.shields.io/npm/v/sanitize-proxy)](https://www.npmjs.com/package/sanitize-proxy)
[![license](https://img.shields.io/npm/l/sanitize-proxy)](LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/clewup/sanitize-proxy/test.yml?branch=main)](https://github.com/clewup/sanitize-proxy/actions)

> A tiny utility to sanitize and redact sensitive fields in JavaScript/TypeScript objects — perfect for logging, debugging, and safely exposing data.


## ✨ Features

- 🔐 Redacts sensitive keys (like `password`, `token`, `apiKey`)
- ⚙️ Customizable redact values and key lists
- 🧼 Strips `<script>` tags from strings
- 🛡️ Detects basic XSS payloads
- 🔁 Handles deep nested objects and arrays
- 🧠 Ignores circular references

---

## 📦 Installation

```bash
npm install sanitize-proxy
```

---

## 🚀 Quick Start

```ts
import { sanitize } from 'sanitize-proxy';

const input = {
  username: 'alice',
  password: 'secret123',
  profile: {
    token: 'abc-123',
    bio: '<script>alert("xss")</script> Welcome!',
  },
};

const clean = sanitize(input, {
  stripUnsafeHtml: true,
  detectXSS: true,
});

console.log(clean);
```

**Output:**

```
{
    username: 'alice',
    password: '[REDACTED]',
    profile: {
    token: '[REDACTED]',
    bio: '[XSS DETECTED]',
}
```

---

## ⚙️  Options

| Option            | Type       | Default        | Description                                                  |
|-------------------|------------|----------------|--------------------------------------------------------------|
| `redact`          | `string[]` | See below      | List of keys to redact                                       |
| `redactValue`     | `string`   | `"[REDACTED]"` | Value used to replace redacted fields                        |
| `stripUnsafeHtml` | `boolean`  | `false`        | Removes `<script>` tags from string values                   |
| `detectXSS`       | `boolean`  | `false`        | Replaces known XSS patterns in strings with `[XSS DETECTED]` |

**Default redacted keys:**
```ts
['password', 'token', 'apiKey', 'ssn']
```

---

## 🧪 Running Tests

```bash
npm test
```

---

## 📄 License

MIT

---

## 🙋‍♀️ Contributing

1. Fork this repo

2. Create your feature branch (git checkout -b feature/awesome)

3. Commit your changes (git commit -am 'Add awesome feature')

4. Push to the branch (git push origin feature/awesome)

5. Open a pull request