import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { load as loadHtml } from 'cheerio';

const origin = process.env.SITE_ORIGIN || 'https://soulcodedheris.com';
const projectRoot = process.cwd();
const manifestPath = join(projectRoot, 'public', 'prerender-manifest.json');

async function ensureDir(path) {
  await mkdir(path, { recursive: true }).catch(() => {});
}

function upsertNamedMeta($, name, content) {
  let el = $(`head meta[name="${name}"]`).first();
  if (!el.length) {
    el = $('<meta>').attr('name', name);
    $('head').append(el);
  }
  el.attr('content', content);
}

function upsertPropertyMeta($, prop, content) {
  let el = $(`head meta[property="${prop}"]`).first();
  if (!el.length) {
    el = $('<meta>').attr('property', prop);
    $('head').append(el);
  }
  el.attr('content', content);
}

function upsertCanonical($, href) {
  let link = $('head link[rel="canonical"]').first();
  if (!link.length) {
    link = $('<link>').attr('rel', 'canonical');
    $('head').append(link);
  }
  link.attr('href', href);
}

function removeExistingOgAndTwitter($) {
  $('head meta[property^="og:"]').remove();
  $('head meta[name^="twitter:"]').remove();
}

async function renderTopLevel(route, { title, description, extraJsonLd } = {}) {
  const template = await readFile(join(projectRoot, 'src', 'index.html'), 'utf8');
  const $ = loadHtml(template);
  const href = `${origin}${route}`;

  $('title').text(title);
  upsertNamedMeta($, 'description', description);
  removeExistingOgAndTwitter($);
  upsertCanonical($, href);
  upsertPropertyMeta($, 'og:title', title);
  upsertPropertyMeta($, 'og:description', description);
  upsertPropertyMeta($, 'og:type', 'website');
  upsertPropertyMeta($, 'og:url', href);
  upsertPropertyMeta($, 'og:site_name', 'SoulCodedHeris');
  upsertPropertyMeta($, 'og:image', `${origin}/soulcodedheris-logo.jpeg`);
  upsertNamedMeta($, 'twitter:card', 'summary_large_image');
  upsertNamedMeta($, 'twitter:title', title);
  upsertNamedMeta($, 'twitter:description', description);
  upsertNamedMeta($, 'twitter:image', `${origin}/soulcodedheris-logo.jpeg`);

  if (extraJsonLd) {
    const script = $('<script>')
      .attr('type', 'application/ld+json')
      .attr('data-prerender', 'true')
      .text(JSON.stringify(extraJsonLd));
    $('head').append(script);
  }

  const outPath = join(projectRoot, 'public', route.replace(/^\//, ''), 'index.html');
  await ensureDir(dirname(outPath));
  await writeFile(outPath, $.html(), 'utf8');
  return route;
}

async function renderArticles() {
  let data;
  try {
    const json = await readFile(join(projectRoot, 'public', 'assets', 'articles.json'), 'utf8');
    data = JSON.parse(json);
  } catch {
    data = [];
  }
  for (const art of data) {
    const template = await readFile(join(projectRoot, 'src', 'index.html'), 'utf8');
    const $ = loadHtml(template);
    const href = `${origin}/articles/${art.slug}`;
    const title = `${art.title} · Articles`;
    const description = art.summary || '';
    // find first image in article HTML
    let ogImage = `${origin}/soulcodedheris-logo.jpeg`;
    try {
      const $content = loadHtml(art.html || '');
      const src = $content('img').first().attr('src') || '';
      if (src) {
        ogImage = /^https?:\/\//i.test(src) ? src : `${origin}${src.startsWith('/') ? src : `/articles/${art.slug}/${src.replace(/^\.\//, '')}`}`;
      }
    } catch {}

    $('title').text(title);
    upsertNamedMeta($, 'description', description);
    removeExistingOgAndTwitter($);
    upsertCanonical($, href);
    upsertPropertyMeta($, 'og:title', title);
    upsertPropertyMeta($, 'og:description', description);
    upsertPropertyMeta($, 'og:type', 'article');
    upsertPropertyMeta($, 'og:url', href);
    upsertPropertyMeta($, 'og:site_name', 'SoulCodedHeris');
    upsertPropertyMeta($, 'og:image', ogImage);
    upsertNamedMeta($, 'twitter:card', 'summary_large_image');
    upsertNamedMeta($, 'twitter:title', title);
    upsertNamedMeta($, 'twitter:description', description);
    upsertNamedMeta($, 'twitter:image', ogImage);

    // Article JSON-LD
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: art.title,
      datePublished: art.date,
      dateModified: art.date,
      description: art.summary,
      mainEntityOfPage: { '@type': 'WebPage', '@id': href }
    };
    const script = $('<script>')
      .attr('type', 'application/ld+json')
      .attr('data-prerender', 'true')
      .text(JSON.stringify(ld));
    $('head').append(script);

    const outPath = join(projectRoot, 'public', 'articles', art.slug, 'index.html');
    await ensureDir(dirname(outPath));
    await writeFile(outPath, $.html(), 'utf8');
  }
}

async function run() {
  // Top-level routes
  const top = [
    { route: '/', title: 'SoulCodedHeris · Software Engineer', description: 'Building purposeful, human‑centered software.' },
    { route: '/work', title: 'Work · SoulCodedHeris', description: 'Selected projects and case studies.' },
    { route: '/articles', title: 'Articles · SoulCodedHeris', description: 'Weekly reflections on purpose, engineering, and design.' },
    { route: '/principles', title: 'Principles · SoulCodedHeris', description: 'Guiding principles and craft philosophy.' },
    { route: '/certifications', title: 'Certifications · SoulCodedHeris', description: 'Verified achievements and credentials.' },
    { route: '/about', title: 'About · SoulCodedHeris', description: 'About Heris (Inioluwa), software engineer.' },
    { route: '/contact', title: 'Contact · SoulCodedHeris', description: 'Get in touch for projects and collaboration.' },
    { route: '/playground', title: 'Playground · SoulCodedHeris', description: 'Small experiments and demos.' }
  ];
  const urls = [];

  for (const t of top) {
    const extraJsonLd = t.route === '/about' ? {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Inioluwa Badairo',
      alternateName: 'Heris',
      url: `${origin}/about`,
      image: `${origin}/Heris-Headshot.jpg`,
      jobTitle: 'Software Engineer'
    } : undefined;
    // Do not overwrite SPA root index.html; skip '/'
    if (t.route !== '/') urls.push(await renderTopLevel(t.route, { title: t.title, description: t.description, extraJsonLd }));
  }

  await renderArticles();
  try {
    const json = await readFile(join(projectRoot, 'public', 'assets', 'articles.json'), 'utf8');
    const arts = JSON.parse(json) || [];
    arts.forEach(a => { if (a && a.slug) urls.push(`/articles/${a.slug}`); });
  } catch {}

  // Pre-render case studies (work/:slug)
  try {
    // Read TS source and extract minimal fields with regex (slug/title/blurb/thumbnailUrl)
    const workSrc = await readFile(join(projectRoot, 'src', 'app', 'pages', 'work', 'work.data.ts'), 'utf8');
    const objectMatches = workSrc.match(/\{[\s\S]*?\}/g) || [];
    const items = objectMatches.map((block) => {
      const get = (key) => {
        const m = block.match(new RegExp(key + ":\\s*'([^']+)'"));
        return m ? m[1] : '';
      };
      return {
        slug: get('slug'),
        title: get('title'),
        blurb: get('blurb'),
        thumbnailUrl: get('thumbnailUrl')
      };
    }).filter(it => it.slug);
    for (const it of items) {
      const template = await readFile(join(projectRoot, 'src', 'index.html'), 'utf8');
      const $ = loadHtml(template);
      const href = `${origin}/work/${it.slug}`;
      const title = `${it.title || it.slug} · Case Study · SoulCodedHeris`;
      const description = it.blurb || 'A practical case study: problem, role, constraints, process, result, reflection.';
      $('title').text(title);
      upsertNamedMeta($, 'description', description);
      removeExistingOgAndTwitter($);
      upsertCanonical($, href);
      upsertPropertyMeta($, 'og:title', title);
      upsertPropertyMeta($, 'og:description', description);
      upsertPropertyMeta($, 'og:type', 'article');
      upsertPropertyMeta($, 'og:url', href);
      upsertPropertyMeta($, 'og:site_name', 'SoulCodedHeris');
      const ogImg = it.thumbnailUrl ? (/^https?:\/\//i.test(it.thumbnailUrl) ? it.thumbnailUrl : `${origin}${it.thumbnailUrl}`) : `${origin}/soulcodedheris-logo.jpeg`;
      upsertPropertyMeta($, 'og:image', ogImg);
      upsertNamedMeta($, 'twitter:card', 'summary_large_image');
      upsertNamedMeta($, 'twitter:title', title);
      upsertNamedMeta($, 'twitter:description', description);
      upsertNamedMeta($, 'twitter:image', ogImg);
      const outPath = join(projectRoot, 'public', 'work', it.slug, 'index.html');
      await ensureDir(dirname(outPath));
      await writeFile(outPath, $.html(), 'utf8');
      urls.push(`/work/${it.slug}`);
    }
  } catch {}

  // Write prerender manifest
  try {
    await writeFile(manifestPath, JSON.stringify({ origin, urls: Array.from(new Set(urls)) }, null, 2), 'utf8');
  } catch {}
}

run().catch(err => { console.error(err); process.exitCode = 1; });


