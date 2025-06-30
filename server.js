const express = require('express');
const crypto = require('crypto');
const app = express();

const PORT = process.env.PORT || 3000;

class PKCE {
  static generateUUIDv4() {
    return "10000000-1000-4000-8000-100000000000"
      .replace(/[018]/g, t =>
        (parseInt(t) ^ (crypto.randomBytes(1)[0] & (15 >> (parseInt(t) / 4)))).toString(16)
      )
      .replace(/-/g, "");
  }

  static generateCodeVerifier() {
    return this.generateUUIDv4() + this.generateUUIDv4() + this.generateUUIDv4();
  }

  static generateCodeChallenge(verifier) {
    const hash = crypto.createHash('sha256').update(verifier).digest();
    return this.base64UrlEncode(hash);
  }

  static base64UrlEncode(buffer) {
    return buffer.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}

app.get('/generate-pkce', (req, res) => {
  const verifier = PKCE.generateCodeVerifier();
  const challenge = PKCE.generateCodeChallenge(verifier);
  res.json({ verifier, challenge });
});

app.get('/', (req, res) => {
  res.send('PKCE API is running. Use /generate-pkce');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
