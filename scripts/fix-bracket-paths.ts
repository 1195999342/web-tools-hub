/**
 * Post-build script to fix bracket paths in Next.js static export.
 * Cloudflare Pages cannot serve files with [ ] in directory names.
 * This script renames [locale] -> _locale_ and [slug] -> _slug_ etc.,
 * then updates all references in HTML and JS files.
 */
import * as fs from 'fs';
import * as path from 'path';

const OUT_DIR = path.resolve(__dirname, '..', 'out');

// Collect all bracket-named directories and build rename map
const renameMap: Map<string, string> = new Map();

function findBracketDirs(dir: string): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
        const safeName = '_' + entry.name.slice(1, -1) + '_';
        const newFull = path.join(dir, safeName);
        renameMap.set(full, newFull);
        // Recurse into the original path first (before rename)
        findBracketDirs(full);
      } else {
        findBracketDirs(full);
      }
    }
  }
}

// Rename directories (deepest first to avoid path issues)
function renameDirs(): void {
  // Sort by path depth descending so we rename deepest first
  const entries = [...renameMap.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [oldPath, newPath] of entries) {
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`  Renamed: ${path.relative(OUT_DIR, oldPath)} -> ${path.relative(OUT_DIR, newPath)}`);
    }
  }
}

// Build string replacement pairs for file content
function buildReplacements(): Array<[string, string]> {
  const replacements: Array<[string, string]> = [];
  for (const [oldPath, newPath] of renameMap) {
    const oldRel = path.relative(OUT_DIR, oldPath).replace(/\\/g, '/');
    const newRel = path.relative(OUT_DIR, newPath).replace(/\\/g, '/');
    // Replace in various encoded forms
    replacements.push([oldRel, newRel]);
    // URL-encoded form: %5Blocale%5D -> _locale_
    const oldEncoded = oldRel.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
    const newEncoded = newRel;
    replacements.push([oldEncoded, newEncoded]);
  }
  return replacements;
}

// Update references in all HTML and JS files
function updateFileReferences(dir: string, replacements: Array<[string, string]>): number {
  let count = 0;
  if (!fs.existsSync(dir)) return count;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += updateFileReferences(full, replacements);
    } else if (/\.(html|js|css|json)$/.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf-8');
      let changed = false;
      for (const [oldStr, newStr] of replacements) {
        if (content.includes(oldStr)) {
          content = content.split(oldStr).join(newStr);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content, 'utf-8');
        count++;
      }
    }
  }
  return count;
}

// Main
console.log('Fixing bracket paths for Cloudflare Pages compatibility...');
findBracketDirs(OUT_DIR);

if (renameMap.size === 0) {
  console.log('No bracket directories found. Nothing to fix.');
  process.exit(0);
}

console.log(`Found ${renameMap.size} bracket directory(ies) to rename:`);
const replacements = buildReplacements();
renameDirs();

console.log('Updating file references...');
const updatedFiles = updateFileReferences(OUT_DIR, replacements);
console.log(`✓ Updated references in ${updatedFiles} file(s)`);
console.log('✓ Bracket path fix complete');
