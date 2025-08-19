import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

export type Crumb = { label: string; url: string };

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  readonly crumbs$ = new BehaviorSubject<Crumb[]>([]);
  private dynamicLabels = new Map<string, string>();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.crumbs$.next(this.buildCrumbs(this.route.root));
    });
  }

  setDynamicLabel(url: string, label: string): void {
    if (!url || !label) return;
    this.dynamicLabels.set(url, label);
    this.crumbs$.next(this.buildCrumbs(this.route.root));
  }

  private buildCrumbs(route: ActivatedRoute, url: string = '', acc: Crumb[] = []): Crumb[] {
    const snapshot = route.snapshot;
    const cfg = snapshot.routeConfig;
    if (cfg && cfg.path !== undefined) {
      const segment = snapshot.url.map((s) => s.path).join('/');
      const nextUrl = segment ? `${url}/${segment}` : url;
      const dataLabel = cfg.data?.['breadcrumb'] as string | undefined;
      const dynLabel = this.dynamicLabels.get(nextUrl);
      const label = dynLabel ?? dataLabel;
      if (label && (nextUrl || '/')) acc.push({ label, url: nextUrl || '/' });
      url = nextUrl;
    }
    const child = route.firstChild;
    return child ? this.buildCrumbs(child, url, acc) : acc;
  }
}




