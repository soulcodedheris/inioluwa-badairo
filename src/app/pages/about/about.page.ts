import { Component, Inject } from '@angular/core';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';
import { RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [BreadcrumbsComponent, RouterLink],
  templateUrl: './about.page.html',
  styleUrl: './about.page.css'
})
export class AboutPage {
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.injectPersonJsonLd();
  }

  private injectPersonJsonLd(): void {
    const origin = this.document.location.origin || 'https://soulcodedheris.com';
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Inioluwa Badairo',
      alternateName: 'Heris',
      url: `${origin}/about`,
      image: `${origin}/Heris-Headshot.jpg`,
      jobTitle: 'Software Engineer',
      sameAs: [
        `${origin}`
      ]
    } as any;
    let script = this.document.head.querySelector('script[type="application/ld+json"][data-person]') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-person', 'true');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}


