import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = path.resolve(__dirname, '..', 'out');
const MAX_FILES = 20000;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

function countFiles(dir: string): { total: number; oversized: string[] } {
  let total = 0;
  const oversized: string[] = [];

  function walk(d: string) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        total++;
        const stat = fs.statSync(full);
        if (stat.size > MAX_FILE_SIZE) {
          oversized.push(`${full} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
        }
      }
    }
  }

  if (fs.existsSync(dir)) {
    walk(dir);
  }
  return { total, oversized };
}

const { total, oversized } = countFiles(OUT_DIR);
console.log(`Total files in out/: ${total}`);

let failed = false;

if (total >= MAX_FILES) {
  console.error(`✗ File count ${total} exceeds limit of ${MAX_FILES}`);
  failed = true;
} else {
  console.log(`✓ File count OK (${total} < ${MAX_FILES})`);
}

if (oversized.length > 0) {
  console.error(`✗ ${oversized.length} file(s) exceed 25 MB:`);
  for (const f of oversized) {
    console.error(`  - ${f}`);
  }
  failed = true;
} else {
  console.log('✓ No files exceed 25 MB');
}

if (failed) {
  process.exit(1);
}
