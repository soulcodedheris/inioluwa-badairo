import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage),
    data: { breadcrumb: 'Home' }
  },
  {
    path: 'articles/:slug',
    loadComponent: () => import('./pages/article-detail/article-detail.page').then(m => m.ArticleDetailPage),
    data: { breadcrumb: 'Article' }
  },
  {
    path: 'work',
    loadComponent: () => import('./pages/work/work.page').then(m => m.WorkPage),
    data: { breadcrumb: 'Work' }
  },
  {
    path: 'work/:slug',
    loadComponent: () => import('./pages/case-study/case-study.page').then(m => m.CaseStudyPage),
    data: { breadcrumb: 'Case Study' }
  },
  {
    path: 'playground',
    loadComponent: () => import('./pages/playground/playground.page').then(m => m.PlaygroundPage),
    data: { breadcrumb: 'Playground' }
  },
  {
    path: 'playground/:slug',
    loadComponent: () => import('./pages/playground/demo.page').then(m => m.DemoPage),
    data: { breadcrumb: 'Demo' }
  },
  {
    path: 'articles',
    loadComponent: () => import('./pages/articles/articles.page').then(m => m.ArticlesPage),
    data: { breadcrumb: 'Articles' }
  },
  {
    path: 'principles',
    loadComponent: () => import('./pages/principles/principles.page').then(m => m.PrinciplesPage),
    data: { breadcrumb: 'Principles' }
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then(m => m.AboutPage),
    data: { breadcrumb: 'About' }
  },
  {
    path: 'certifications',
    loadComponent: () => import('./pages/certifications/certifications.page').then(m => m.CertificationsPage),
    data: { breadcrumb: 'Certifications' }
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then(m => m.ContactPage),
    data: { breadcrumb: 'Contact' }
  },
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.page').then(m => m.NotFoundPage)
  },
  { path: '**', redirectTo: 'not-found' }
];
