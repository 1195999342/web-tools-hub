/**
 * Unified build script for Cloudflare Pages deployment.
 * Runs next build, then all post-processing scripts.
 */
import { execSync } from 'child_process';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

function run(cmd: string, label: string) {
  console.log(`\n=== ${label} ===`);
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'inherit' });
    console.log(`✓ ${label} complete`);
  } catch (e) {
    console.error(`✗ ${label} failed`);
    process.exit(1);
  }
}

run('npx next build', 'Next.js Build');
run('npx tsx scripts/fix-bracket-paths.ts', 'Fix Bracket Paths');
run('npx tsx scripts/generate-sitemap.ts', 'Generate Sitemap');
run('npx tsx scripts/generate-headers.ts', 'Generate Headers');
run('npx tsx scripts/generate-redirects.ts', 'Generate Redirects');

console.log('\n✓ Full build complete!');
