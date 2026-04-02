import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = path.resolve(__dirname, '..', 'out');

const headers = `# Static assets — long cache, immutable
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

# HTML pages — always revalidate
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# WASM files — long cache
/*.wasm
  Content-Type: application/wasm
  Cache-Control: public, max-age=31536000, immutable

# Security headers for all paths
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, '_headers'), headers, 'utf-8');
console.log('✓ _headers generated');
