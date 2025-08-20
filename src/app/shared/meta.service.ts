import { Injectable, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MetaService {
  constructor(
    private router: Router,
    private title: Title,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  init(): void {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => this.applyForRoute());
    this.applyForRoute();
  }

  private applyForRoute(): void {
    const url = this.document.location.pathname;
    const map: Record<string, { title: string; description: string } > = {
      '/': { title: 'SoulCodedHeris · Software Engineer', description: 'Building purposeful, human‑centered software.' },
      '/articles': { title: 'Articles · SoulCodedHeris', description: 'Weekly reflections on purpose, engineering, and design.' },
      '/work': { title: 'Work · SoulCodedHeris', description: 'Selected projects and case studies.' },
      '/principles': { title: 'Principles · SoulCodedHeris', description: 'Guiding principles and craft philosophy.' },
      '/certifications': { title: 'Certifications · SoulCodedHeris', description: 'Verified achievements and credentials.' },
      '/about': { title: 'About · SoulCodedHeris', description: 'About Heris (Inioluwa), software engineer.' },
      '/contact': { title: 'Contact · SoulCodedHeris', description: 'Get in touch for projects and collaboration.' },
      '/playground': { title: 'Playground · SoulCodedHeris', description: 'Small experiments and demos.' }
    };

    const key = Object.keys(map).find(k => url === k) || '/';
    const meta = map[key];
    if (meta) {
      this.title.setTitle(meta.title);
      this.setNamedMeta('description', meta.description);
      this.setPropertyMeta('og:title', meta.title);
      this.setPropertyMeta('og:description', meta.description);
      this.setPropertyMeta('og:url', this.document.location.href);
    }
  }

  private setNamedMeta(name: string, content: string): void {
    let el = this.document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (!el) { el = this.document.createElement('meta'); el.setAttribute('name', name); this.document.head.appendChild(el); }
    el.setAttribute('content', content);
  }

  private setPropertyMeta(prop: string, content: string): void {
    let el = this.document.head.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
    if (!el) { el = this.document.createElement('meta'); el.setAttribute('property', prop); this.document.head.appendChild(el); }
    el.setAttribute('content', content);
  }
}


