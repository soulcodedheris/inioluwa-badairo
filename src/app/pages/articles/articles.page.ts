import { Component, effect, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

type Article = { title: string; date: string; summary: string; slug: string };

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './articles.page.html',
  styleUrl: './articles.page.css'
})
export class ArticlesPage {
  articles = signal<Article[]>([]);

  constructor(private http: HttpClient) {
    this.http.get<Article[]>('/assets/articles.json')
      .subscribe({
        next: (list) => this.articles.set(list ?? []),
        error: () => this.articles.set([])
      });
  }
}


