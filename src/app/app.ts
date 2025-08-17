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
  constructor(private theme: ThemeService) {
    this.theme.init();
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
}
