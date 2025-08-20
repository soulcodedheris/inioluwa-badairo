import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPrefetchRoute]',
  standalone: true
})
export class PrefetchRouteDirective {
  @Input('appPrefetchRoute') routePath: string | undefined;
  private prefetched = false;

  @HostListener('mouseenter') onHover() {
    this.prefetch();
  }

  private async prefetch() {
    if (this.prefetched) return;
    const path = this.routePath || '';
    try {
      switch (path) {
        case '/work':
          await import('../pages/work/work.page');
          break;
        case '/playground':
          await import('../pages/playground/playground.page');
          break;
        case '/articles':
          await import('../pages/articles/articles.page');
          break;
        case '/principles':
          await import('../pages/principles/principles.page');
          break;
        case '/certifications':
          await import('../pages/certifications/certifications.page');
          break;
        case '/about':
          await import('../pages/about/about.page');
          break;
        case '/contact':
          await import('../pages/contact/contact.page');
          break;
        default:
          break;
      }
      this.prefetched = true;
    } catch {}
  }
}


