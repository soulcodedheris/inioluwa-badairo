import { Component, Inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe, DOCUMENT, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';
import { BreadcrumbService } from '../../shared/breadcrumb.service';

type Article = { title: string; date: string; summary: string; slug: string; html: string; status?: string; category?: string };

@Component({
  selector: 'app-article-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe, NgClass, BreadcrumbsComponent],
  templateUrl: './article-detail.page.html',
  styleUrl: './article-detail.page.css'
})
export class ArticleDetailPage {
  article = signal<Article | null>(null);
  safeHtml = signal<string | null>(null);
  toc = signal<{ id: string; text: string }[]>([]);
  copied = signal<boolean>(false);
  activeTocId = signal<string | null>(null);
  private scrollHandler?: () => void;
  private observer?: IntersectionObserver;
  private intersectionObserver?: IntersectionObserver;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private breadcrumbs: BreadcrumbService
  ) {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!slug) return;

    this.loadFromJson(slug);
  }

  copyUrl(): void {
    const url = this.document.location.href;
    navigator?.clipboard?.writeText(url).catch(() => {});
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1200);
  }

  get twitterShareUrl(): string {
    const url = encodeURIComponent(this.document.location.href);
    const text = encodeURIComponent(this.article()?.title || '');
    return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
  }

  get linkedinShareUrl(): string {
    const url = encodeURIComponent(this.document.location.href);
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  }

  private loadFromJson(slug: string): void {
    this.http.get<Article[]>(`/assets/articles.json`).subscribe({
      next: (list) => {
        const found = (list || []).find(a => a.slug === slug) || null;
        this.article.set(found);
        if (found) {
          // Prepare and sanitize HTML, update TOC and metadata
          this.prepareHtml(found).then(html => {
            this.safeHtml.set(html);
            this.setCanonical(slug);
            this.setMetaForArticle(found);
            this.setupReadingProgress();
            this.observeHeadings();
            this.setupTocHighlight();
            this.breadcrumbs.setDynamicLabel(this.document.location.pathname, found.title);
          });
        }
      },
      error: () => this.article.set(null)
    });
  }

  private async prepareHtml(found: Article): Promise<string> {
    const div = this.document.createElement('div');
    div.innerHTML = found.html || '';

    // Add ids to h2 headings and build TOC
    const headings = Array.from(div.querySelectorAll('h2')) as HTMLHeadingElement[];
    const items: { id: string; text: string }[] = [];
    headings.forEach((h, i) => {
      if (!h.id) {
        const base = (h.textContent || `h2-${i}`).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
        const id = base || `h2-${i}`;
        h.id = id;
      }
      items.push({ id: h.id, text: h.textContent || `Section ${i + 1}` });
    });
    this.toc.set(items);

    // Optimize images
    const imgs = Array.from(div.querySelectorAll('img')) as HTMLImageElement[];
    imgs.forEach(img => {
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    });

    // External links harden
    const anchors = Array.from(div.querySelectorAll('a')) as HTMLAnchorElement[];
    anchors.forEach(a => {
      const href = a.getAttribute('href') || '';
      const isExternal = /^https?:\/\//i.test(href) && !href.startsWith(this.document.location.origin);
      if (isExternal) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Sanitize via DOMPurify (load on demand if needed)
    await this.ensureDOMPurify();
    const sanitized = (window as any).DOMPurify ? (window as any).DOMPurify.sanitize(div.innerHTML, { USE_PROFILES: { html: true } }) : div.innerHTML;
    return sanitized;
  }

  private setCanonical(slug: string): void {
    const head = this.document.head;
    let link: HTMLLinkElement | null = head.querySelector('link[rel="canonical"]');
    const href = `${this.document.location.origin}/articles/${slug}`;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setMetaForArticle(art: Article): void {
    const head = this.document.head;
    const title = art.title;
    const description = art.summary || '';
    // Title
    this.document.title = `${title} · Articles`;
    // Basic description
    this.setNamedMeta('description', description);
    // Robots for drafts
    const status = (art as any).status || '';
    if (status.toLowerCase() === 'draft') {
      this.setNamedMeta('robots', 'noindex,follow');
    }
    // Open Graph
    this.setPropertyMeta('og:title', title);
    this.setPropertyMeta('og:description', description);
    this.setPropertyMeta('og:type', 'article');
    this.setPropertyMeta('og:url', `${this.document.location.href}`);
    this.setPropertyMeta('og:site_name', 'SoulCodedHeris');
    // Select first image for OG/Twitter if present
    const imgUrl = this.findFirstImageUrl();

    // Twitter
    this.setNamedMeta('twitter:card', 'summary_large_image');
    this.setNamedMeta('twitter:title', title);
    this.setNamedMeta('twitter:description', description);
    if (imgUrl) {
      this.setPropertyMeta('og:image', imgUrl);
      this.setNamedMeta('twitter:image', imgUrl);
    }

    // JSON-LD Article schema
    const ld: any = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: art.title,
      datePublished: art.date,
      dateModified: art.date,
      description: art.summary,
      mainEntityOfPage: { '@type': 'WebPage', '@id': this.document.location.href },
      articleSection: (art as any).category || undefined
    };
    this.setJsonLd(ld);
  }

  private findFirstImageUrl(): string | null {
    const html = this.safeHtml() || this.article()?.html || '';
    const div = this.document.createElement('div');
    div.innerHTML = html;
    const img = div.querySelector('img') as HTMLImageElement | null;
    if (!img) return null;
    const src = img.getAttribute('src') || '';
    if (!src) return null;
    if (/^https?:\/\//i.test(src)) return src;
    // Resolve relative to article route
    const slug = this.article()?.slug || '';
    const path = src.startsWith('/') ? src : `/articles/${slug}/${src.replace(/^\.\//, '')}`;
    return `${this.document.location.origin}${path}`;
  }

  private setNamedMeta(name: string, content: string): void {
    let el = this.document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = this.document.createElement('meta');
      el.setAttribute('name', name);
      this.document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  private setPropertyMeta(prop: string, content: string): void {
    let el = this.document.head.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = this.document.createElement('meta');
      el.setAttribute('property', prop);
      this.document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  private setJsonLd(obj: any): void {
    let script = this.document.head.querySelector('script[type="application/ld+json"][data-article]') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-article', 'true');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(obj);
  }

  private ensureDOMPurify(): Promise<void> {
    if ((window as any).DOMPurify) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const existing = this.document.querySelector('script[data-dompurify]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => resolve(), { once: true });
        return;
      }
      const s = this.document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js';
      s.async = true;
      s.setAttribute('data-dompurify', 'true');
      s.onload = () => resolve();
      s.onerror = () => resolve();
      this.document.head.appendChild(s);
    });
  }

  private setupReadingProgress(): void {
    const bar = this.document.getElementById('read-progress');
    const back = this.document.getElementById('back-to-articles');
    if (!bar) return;
    const onScroll = () => {
      const doc = this.document.documentElement;
      const body = this.document.body;
      const scrollTop = doc.scrollTop || body.scrollTop;
      const height = (doc.scrollHeight || body.scrollHeight) - doc.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      (bar as HTMLElement).style.width = `${pct}%`;
      if (back) (back as HTMLElement).style.display = scrollTop > 600 ? 'inline-flex' : 'none';
    };
    this.scrollHandler = onScroll;
    this.document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  private observeHeadings(): void {
    const root = this.document.getElementById('article-content');
    if (!root) return;
    const headings = Array.from(root.querySelectorAll('h2')) as HTMLHeadingElement[];
    if (!headings.length) return;
    this.observer?.disconnect();
    this.observer = new IntersectionObserver((entries) => {
      // pick the entry closest to top that is intersecting
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a,b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
      const pick = (visible[0]?.target as HTMLElement | undefined)?.id || null;
      if (pick) this.activeTocId.set(pick);
    }, { rootMargin: '-20% 0% -70% 0%', threshold: [0, 1] });
    headings.forEach(h => this.observer!.observe(h));
  }

  private setupTocHighlight(): void {
    if (!this.toc().length) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            this.activeTocId.set(id);
          }
        });
      },
      { rootMargin: '-20% 0px -35% 0px' }
    );

    // Observe all headings that are in the TOC
    this.toc().forEach((item) => {
      const element = this.document.getElementById(item.id);
      if (element) {
        this.intersectionObserver!.observe(element);
      }
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.intersectionObserver?.disconnect();
    if (this.scrollHandler) {
      this.document.removeEventListener('scroll', this.scrollHandler);
    }
  }
}


