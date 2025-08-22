import { mkdir, stat, copyFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const root = process.cwd();
const vendorDir = join(root, 'public', 'vendor');
const fontsDir = join(root, 'public', 'fonts');

async function ensureDir(p) { await mkdir(p, { recursive: true }).catch(() => {}); }

async function main() {
  await ensureDir(vendorDir);
  await ensureDir(fontsDir);

  // Copy DOMPurify from node_modules to public/vendor
  const src = join(root, 'node_modules', 'dompurify', 'dist', 'purify.min.js');
  const dest = join(vendorDir, 'dompurify.min.js');
  try {
    await stat(src);
  } catch {
    console.error('[copy-vendor] Missing dependency: dompurify. Install it with: npm i -D dompurify');
    process.exitCode = 1;
    return;
  }
  await copyFile(src, dest);

  // Copy Inter variable font to public/fonts/Inter-Variable.woff2 if available
  const interFilesDir = join(root, 'node_modules', '@fontsource-variable', 'inter', 'files');
  try {
    await stat(interFilesDir);
    const files = await readdir(interFilesDir);
    const woff2 = files.filter(f => f.endsWith('.woff2'));
    if (woff2.length) {
      // Prefer wghtOnly normal roman if present
      const preferred = woff2.find(f => /wghtOnly.*normal.*\.woff2$/i.test(f)) || woff2[0];
      const srcFont = join(interFilesDir, preferred);
      const destFont = join(fontsDir, 'Inter-Variable.woff2');
      await copyFile(srcFont, destFont);
    } else {
      console.warn('[copy-vendor] No .woff2 files found for @fontsource-variable/inter; skipping font copy');
    }
  } catch {
    console.warn('[copy-vendor] @fontsource-variable/inter not found. Install it with: npm i -D @fontsource-variable/inter');
  }
}

main().catch(err => { console.error(err); process.exitCode = 1; });


