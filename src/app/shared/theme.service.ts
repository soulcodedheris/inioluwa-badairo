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
    // Debug: log theme state
    console.log('Theme initialized:', dark ? 'dark' : 'light');
  }

  toggle(): void {
    const next = !document.documentElement.classList.contains('dark');
    this.apply(next);
    try { localStorage.setItem('theme', next ? 'dark' : 'light'); } catch {}
    // Debug: log toggle
    console.log('Theme toggled to:', next ? 'dark' : 'light');
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


