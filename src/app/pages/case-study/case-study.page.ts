import { Component, Inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { TitleCasePipe } from '@angular/common';
import { AppearDirective } from '../../shared/appear.directive';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';
import { WORK_ITEMS } from '../work/work.data';

@Component({
  selector: 'app-case-study-page',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, AppearDirective, BreadcrumbsComponent],
  templateUrl: './case-study.page.html',
  styleUrl: './case-study.page.css'
})
export class CaseStudyPage {
  item: any = null;
  constructor(public route: ActivatedRoute, @Inject(DOCUMENT) private document: Document) {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      this.item = WORK_ITEMS.find(i => i.slug === slug) || null;
      this.applyMeta();
    });
  }

  private applyMeta(): void {
    const it = this.item;
    if (!it) return;
    const title = `${it.title} · Case Study · SoulCodedHeris`;
    const description = it.blurb || 'A practical case study: problem, role, constraints, process, result, reflection.';
    const origin = this.document.location.origin;
    const href = `${origin}/work/${it.slug}`;
    this.document.title = title;
    this.setNamedMeta('description', description);
    this.setNamedMeta('twitter:card', 'summary_large_image');
    this.setNamedMeta('twitter:title', title);
    this.setNamedMeta('twitter:description', description);
    const image = it.thumbnailUrl ? (it.thumbnailUrl.startsWith('http') ? it.thumbnailUrl : `${origin}${it.thumbnailUrl}`) : `${origin}/soulcodedheris-logo.jpeg`;
    this.setNamedMeta('twitter:image', image);
    this.setPropertyMeta('og:title', title);
    this.setPropertyMeta('og:description', description);
    this.setPropertyMeta('og:type', 'article');
    this.setPropertyMeta('og:url', href);
    this.setPropertyMeta('og:image', image);
    this.setCanonical(href);
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

  private setCanonical(absHref: string): void {
    let link = this.document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = this.document.createElement('link'); link.setAttribute('rel', 'canonical'); this.document.head.appendChild(link); }
    link.setAttribute('href', absHref);
  }
}


