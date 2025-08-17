import { Component, effect, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

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
  imports: [DatePipe, RouterLink],
  templateUrl: './articles.page.html',
  styleUrl: './articles.page.css'
})
export class ArticlesPage {
  articles = signal<Article[]>([]);

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


