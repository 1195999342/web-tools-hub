import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = path.resolve(__dirname, '..', 'out');

const redirects = `/ /en/ 302
/tools/* /en/tools/:splat 302
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, '_redirects'), redirects, 'utf-8');
console.log('✓ _redirects generated');
