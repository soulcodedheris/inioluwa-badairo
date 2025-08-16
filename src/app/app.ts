import { Component, OnDestroy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/theme.service';
import { ParticlesBackgroundComponent } from './shared/particles-background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ParticlesBackgroundComponent],
  templateUrl: './app.html',
  // styleUrl removed; using global Tailwind styles
})
export class App implements OnDestroy {
  protected readonly title = signal('portfolio');
  protected readonly isMenuOpen = signal(false);
  private readonly onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isMenuOpen()) {
      this.closeMenu();
    }
  };
  constructor(private theme: ThemeService) {
    this.theme.init();
    window.addEventListener('keydown', this.onKeydown);
  }

  toggleTheme() {
    this.theme.toggle();
  }

  toggleMenu() {
    const next = !this.isMenuOpen();
    this.isMenuOpen.set(next);
    document.documentElement.classList.toggle('overflow-hidden', next);
    document.body.classList.toggle('overflow-hidden', next);
  }

  closeMenu() {
    if (!this.isMenuOpen()) return;
    this.isMenuOpen.set(false);
    document.documentElement.classList.remove('overflow-hidden');
    document.body.classList.remove('overflow-hidden');
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeydown);
  }
}
