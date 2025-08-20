import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { PrefetchRouteDirective } from './shared/prefetch.directive';
import { ThemeService } from './shared/theme.service';
import { MetaService } from './shared/meta.service';
import { ParticlesBackgroundComponent } from './shared/particles-background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ParticlesBackgroundComponent, NgClass, PrefetchRouteDirective],
  templateUrl: './app.html',
  // styleUrl removed; using global Tailwind styles
})
export class App {
  protected readonly title = signal('portfolio');
  mobileOpen = signal(false);
  motion = signal<boolean>(true);
  scrolled = signal<boolean>(false);
  constructor(private theme: ThemeService, private meta: MetaService) {
    this.theme.init();
    this.meta.init();
    // Initialize motion preference
    try {
      const stored = localStorage.getItem('motion');
      let enabled: boolean;
      if (stored === 'on') enabled = true;
      else if (stored === 'off') enabled = false;
      else {
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        enabled = !prefersReduced;
      }
      this.motion.set(enabled);
      document.documentElement.setAttribute('data-motion', enabled ? 'on' : 'off');
    } catch {}
    // Show/hide back-to-top button and toggle scrolled state for header
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const btn = document.getElementById('backToTop');
      if (btn) btn.style.display = y > 600 ? 'inline-flex' : 'none';
      this.scrolled.set(y > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Run once after current tick so DOM exists
    setTimeout(onScroll, 0);

    // Track header height and expose as CSS variable --header-h
    const setHeaderVar = () => {
      const header = document.querySelector('header');
      const height = header ? (header as HTMLElement).clientHeight : 0;
      document.documentElement.style.setProperty('--header-h', `${height}px`);
    };
    // Delay to ensure header has rendered
    setTimeout(setHeaderVar, 0);
    window.addEventListener('resize', setHeaderVar, { passive: true });
  }

  toggleTheme() {
    this.theme.toggle();
  }

  toggleMobileNav() {
    this.mobileOpen.update(v => !v);
    if (!this.mobileOpen()) {
      const btn = document.querySelector('[aria-controls="mobile-menu"]') as HTMLButtonElement | null;
      btn?.focus();
    }
    // Focus trap when open
    if (this.mobileOpen()) {
      setTimeout(() => {
        const menu = document.getElementById('mobile-menu');
        if (!menu) return;
        const focusables = menu.querySelectorAll<HTMLElement>('a, button');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        first?.focus();
        const handler = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return;
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
        };
        menu.addEventListener('keydown', handler);
        const remove = () => menu.removeEventListener('keydown', handler);
        const observer = new MutationObserver(() => { if (!this.mobileOpen()) { remove(); observer.disconnect(); } });
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
      });
    }
  }

  closeMobileNav() {
    this.mobileOpen.set(false);
    const btn = document.querySelector('[aria-controls="mobile-menu"]') as HTMLButtonElement | null;
    btn?.focus();
  }

  toggleMotion() {
    try {
      const current = this.motion();
      const next = !current;
      this.motion.set(next);
      const storeVal = next ? 'on' : 'off';
      localStorage.setItem('motion', storeVal);
      document.documentElement.setAttribute('data-motion', storeVal);
    } catch {}
  }

  scrollToTop(): void {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }
}
