import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { marked } from 'marked';

const srcDir = join(process.cwd(), 'src', 'articles');
const outFile = join(process.cwd(), 'public', 'assets', 'articles.json');

function extractFrontmatter(text) {
  // naive YAML frontmatter parser: expects ---\nkey: value\n--- at top
  if (!text.startsWith('---')) return { meta: {}, body: text };
  const end = text.indexOf('\n---', 3);
  if (end === -1) return { meta: {}, body: text };
  const block = text.slice(3, end).trim();
  const body = text.slice(end + 4).trim();
  const meta = {};
  for (const line of block.split('\n')) {
    const [k, ...rest] = line.split(':');
    if (!k) continue;
    meta[k.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
  }
  return { meta, body };
}

async function run() {
  try {
    const files = await readdir(srcDir).catch(() => []);
    const articles = [];
    for (const f of files) {
      if (!f.endsWith('.md')) continue;
      const slug = basename(f, '.md');
      const raw = await readFile(join(srcDir, f), 'utf8');
      const { meta, body } = extractFrontmatter(raw);
      const html = marked.parse(body);
      const title = meta.title || slug;
      const date = meta.date || new Date().toISOString().slice(0,10);
      const summary = meta.summary || body.split('\n').find(Boolean)?.slice(0,160) || '';
      articles.push({ slug, title, date, summary, html });
    }
    articles.sort((a,b) => (a.date < b.date ? 1 : -1));
    await mkdir(join(process.cwd(), 'public', 'assets'), { recursive: true });
    await writeFile(outFile, JSON.stringify(articles, null, 2), 'utf8');
    console.log(`Wrote ${articles.length} articles to assets.`);

    // Also copy particles.js to public for reliable loading on hosts without CDN
    try {
      const srcLib = join(process.cwd(), 'node_modules', 'particles.js', 'particles.min.js');
      const outDir = join(process.cwd(), 'public', 'vendor');
      await mkdir(outDir, { recursive: true });
      await copyFile(srcLib, join(outDir, 'particles.min.js'));
      console.log('Copied particles.min.js to public/vendor.');
    } catch (e) {
      console.warn('Could not copy particles.min.js to public/vendor:', e?.message || e);
    }
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
}

run();


