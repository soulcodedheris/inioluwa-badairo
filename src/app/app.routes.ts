import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'articles/:slug',
    loadComponent: () => import('./pages/article-detail/article-detail.page').then(m => m.ArticleDetailPage)
  },
  {
    path: 'work',
    loadComponent: () => import('./pages/work/work.page').then(m => m.WorkPage)
  },
  {
    path: 'work/:slug',
    loadComponent: () => import('./pages/case-study/case-study.page').then(m => m.CaseStudyPage)
  },
  {
    path: 'playground',
    loadComponent: () => import('./pages/playground/playground.page').then(m => m.PlaygroundPage)
  },
  {
    path: 'articles',
    loadComponent: () => import('./pages/articles/articles.page').then(m => m.ArticlesPage)
  },
  {
    path: 'principles',
    loadComponent: () => import('./pages/principles/principles.page').then(m => m.PrinciplesPage)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then(m => m.ContactPage)
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage)
  },
  { path: '**', redirectTo: 'not-found' }
];
