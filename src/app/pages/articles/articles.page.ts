import { Component, effect, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';

type Article = { title: string; date: string; summary: string; slug: string; html?: string; readMins?: number };

function estimateReadTime(html: string | undefined): number {
  if (!html) return 1;
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  const minutes = Math.max(1, Math.round(words / 225));
  return minutes;
}

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [DatePipe, RouterLink, BreadcrumbsComponent, FormsModule],
  templateUrl: './articles.page.html',
  styleUrl: './articles.page.css'
})
export class ArticlesPage {
  articles = signal<Article[]>([]);
  query = signal<string>('');
  sort = signal<'new'|'short'>('new');
  queryValue = '';
  sortValue: 'new'|'short' = 'new';

  // Category chips
  selectedCats = signal<Set<string>>(new Set());
  categories = computed(() => {
    const set = new Set<string>();
    this.articles().forEach(a => {
      const c = (a as any).category as string | undefined;
      if (c && c.trim()) set.add(c);
    });
    return Array.from(set).sort();
  });

  toggleCategory(cat: string): void {
    if (!cat) { this.selectedCats.set(new Set()); return; }
    const next = new Set(this.selectedCats());
    if (next.has(cat)) next.delete(cat); else next.add(cat);
    this.selectedCats.set(next);
  }

  filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    let arr = this.articles();
    if (q) arr = arr.filter(a => a.title.toLowerCase().includes(q) || (a.summary||'').toLowerCase().includes(q));
    const cats = this.selectedCats();
    if (cats.size) arr = arr.filter(a => cats.has(((a as any).category as string) || ''));
    if (this.sort() === 'short') arr = [...arr].sort((a,b) => (a.readMins||0) - (b.readMins||0));
    else arr = [...arr].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return arr;
  });

  constructor(private http: HttpClient) {
    this.http.get<any[]>('/assets/articles.json')
      .subscribe({
        next: (list) => {
          const mapped = (list ?? []).map(a => ({ ...a, readMins: estimateReadTime((a as any).html) }));
          this.articles.set(mapped);
        },
        error: () => this.articles.set([])
      });
  }
}


