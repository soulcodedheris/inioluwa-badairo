import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import slug from 'remark-slug';
import { load as loadHtml } from 'cheerio';
import { imageSize } from 'image-size';

const srcDir = join(process.cwd(), 'src', 'articles');
const outFile = join(process.cwd(), 'public', 'assets', 'articles.json');
const devOutFile = join(process.cwd(), 'src', 'assets', 'articles.json');
const sitemapFile = join(process.cwd(), 'public', 'sitemap.xml');

async function renderMarkdown(md) {
  const processor = remark().use(gfm).use(slug).use(html, { sanitize: false });
  const file = await processor.process(md);
  return String(file);
}

async function run() {
  try {
    const files = await readdir(srcDir).catch(() => []);
    const articles = [];
    for (const f of files) {
      if (!f.endsWith('.md')) continue;
      const slug = basename(f, '.md');
      const raw = await readFile(join(srcDir, f), 'utf8');
      const parsed = matter(raw);
      const body = parsed.content || '';
      let htmlStr = await renderMarkdown(body);
      // Enhance images with dimensions and loading hints when possible
      try {
        const $ = loadHtml(htmlStr);
        $('img').each((_, el) => {
          const $img = $(el);
          const src = $img.attr('src') || '';
          if (!src) return;
          const resolved = src.startsWith('/')
            ? join(process.cwd(), 'public', src)
            : join(srcDir, slug, src.replace(/^\.\//, ''));
          try {
            const dim = imageSize(resolved);
            if (dim?.width && dim?.height) {
              $img.attr('width', String(dim.width));
              $img.attr('height', String(dim.height));
            }
          } catch {}
          if (!$img.attr('loading')) $img.attr('loading', 'lazy');
          if (!$img.attr('decoding')) $img.attr('decoding', 'async');
        });
        htmlStr = $.html();
      } catch {}
      const meta = parsed.data || {};
      const title = meta.title || slug;
      const date = meta.date || new Date().toISOString().slice(0,10);
      const summary = meta.summary || body.split('\n').find(Boolean)?.slice(0,160) || '';
      const status = meta.status || '';
      const category = meta.category || '';
      const platforms = meta.platforms || [];
      articles.push({ slug, title, date, summary, html: htmlStr, status, category, platforms });
    }
    articles.sort((a,b) => (a.date < b.date ? 1 : -1));
    const publicAssetsDir = join(process.cwd(), 'public', 'assets');
    const srcAssetsDir = join(process.cwd(), 'src', 'assets');
    await mkdir(publicAssetsDir, { recursive: true });
    await mkdir(srcAssetsDir, { recursive: true });
    const json = JSON.stringify(articles, null, 2);
    await writeFile(outFile, json, 'utf8');
    await writeFile(devOutFile, json, 'utf8');
    await writeFile(sitemapFile, await generateSitemap(articles), 'utf8');
    await writeFile(join(process.cwd(), 'public', 'feed.xml'), generateRss(articles), 'utf8');
    await writeFile(join(process.cwd(), 'public', 'feed.json'), generateJsonFeed(articles), 'utf8');
    console.log(`Wrote ${articles.length} articles to assets (public and src) and updated sitemap and feeds.`);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  }
}

run();


async function generateSitemap(articles) {
  const origin = process.env.SITE_ORIGIN || 'https://soulcodedheris.com';
  const staticSources = [
    { path: '/', file: join(process.cwd(), 'src', 'app', 'pages', 'home', 'home.page.html') },
    { path: '/work', file: join(process.cwd(), 'src', 'app', 'pages', 'work', 'work.page.html') },
    { path: '/playground', file: join(process.cwd(), 'src', 'app', 'pages', 'playground', 'playground.page.html') },
    { path: '/articles', file: join(process.cwd(), 'src', 'app', 'pages', 'articles', 'articles.page.html') },
    { path: '/principles', file: join(process.cwd(), 'src', 'app', 'pages', 'principles', 'principles.page.html') },
    { path: '/about', file: join(process.cwd(), 'src', 'app', 'pages', 'about', 'about.page.html') },
    { path: '/contact', file: join(process.cwd(), 'src', 'app', 'pages', 'contact', 'contact.page.html') }
  ];
  const urls = [];
  for (const s of staticSources) {
    let lastmod = new Date().toISOString().slice(0,10);
    try { const m = await stat(s.file); lastmod = m.mtime.toISOString().slice(0,10); } catch {}
    urls.push(`<url><loc>${origin}${s.path}</loc><lastmod>${lastmod}</lastmod></url>`);
  }
  for (const a of articles) {
    let lastmod = a.date;
    try { const m = await stat(join(process.cwd(), 'src', 'articles', `${a.slug}.md`)); lastmod = m.mtime.toISOString().slice(0,10); } catch {}
    urls.push(`<url><loc>${origin}/articles/${a.slug}</loc><lastmod>${lastmod}</lastmod></url>`);
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

function generateRss(articles) {
  const origin = process.env.SITE_ORIGIN || 'https://soulcodedheris.com';
  const items = articles.map(a => `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${origin}/articles/${a.slug}</link>
      <guid>${origin}/articles/${a.slug}</guid>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
      <description><![CDATA[${a.summary}]]></description>
    </item>`).join('\n');
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>
  <rss version=\"2.0\">
    <channel>
      <title>SoulCodedHeris · Articles</title>
      <link>${origin}/articles</link>
      <description>Articles by SoulCodedHeris</description>
      ${items}
    </channel>
  </rss>`;
}

function generateJsonFeed(articles) {
  const origin = process.env.SITE_ORIGIN || 'https://soulcodedheris.com';
  return JSON.stringify({
    version: 'https://jsonfeed.org/version/1.1',
    title: 'SoulCodedHeris · Articles',
    home_page_url: `${origin}/articles`,
    feed_url: `${origin}/feed.json`,
    items: articles.map(a => ({
      id: `${origin}/articles/${a.slug}`,
      url: `${origin}/articles/${a.slug}`,
      title: a.title,
      date_published: new Date(a.date).toISOString(),
      content_text: a.summary
    }))
  }, null, 2);
}

