import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark(): boolean {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
    if (stored) return stored === 'dark';
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  init(): void {
    const dark = this.isDark();
    this.apply(dark);
  }

  toggle(): void {
    const next = !document.documentElement.classList.contains('dark');
    this.apply(next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
  }

  private apply(dark: boolean): void {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}


