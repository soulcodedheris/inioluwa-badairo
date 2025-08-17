import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { ThemeService } from './shared/theme.service';
import { ParticlesBackgroundComponent } from './shared/particles-background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ParticlesBackgroundComponent, NgClass],
  templateUrl: './app.html',
  // styleUrl removed; using global Tailwind styles
})
export class App {
  protected readonly title = signal('portfolio');
  mobileOpen = signal(false);
  motion = signal<boolean>(true);
  constructor(private theme: ThemeService) {
    this.theme.init();
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
  }

  toggleTheme() {
    this.theme.toggle();
  }

  toggleMobileNav() {
    this.mobileOpen.update(v => !v);
  }

  closeMobileNav() {
    this.mobileOpen.set(false);
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
}
