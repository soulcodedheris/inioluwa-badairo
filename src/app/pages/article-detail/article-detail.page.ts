import { Component, Inject, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';

type Article = { title: string; date: string; summary: string; slug: string; html: string };

@Component({
  selector: 'app-article-detail-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './article-detail.page.html',
  styleUrl: './article-detail.page.css'
})
export class ArticleDetailPage {
  article = signal<Article | null>(null);
  safeHtml = computed<SafeHtml | null>(() => this.article() ? this.sanitizer.bypassSecurityTrustHtml(this.article()!.html) : null);
  toc = signal<{ id: string; text: string }[]>([]);

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    const slug = this.route.snapshot.paramMap.get('slug') || '';
    if (!slug) return;

    this.loadFromJson(slug);
  }

  private loadFromJson(slug: string): void {
    this.http.get<Article[]>(`/assets/articles.json`).subscribe({
      next: (list) => {
        const found = (list || []).find(a => a.slug === slug) || null;
        this.article.set(found);
        if (found) {
          this.extractToc(found.html);
          this.setCanonical(slug);
        }
      },
      error: () => this.article.set(null)
    });
  }

  private extractToc(html: string): void {
    const div = this.document.createElement('div');
    div.innerHTML = html;
    const headings = Array.from(div.querySelectorAll('h2')) as HTMLHeadingElement[];
    const items = headings.map((h, i) => ({ id: h.id || `h2-${i}`, text: h.textContent || `Section ${i + 1}` }));
    this.toc.set(items);
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
}


