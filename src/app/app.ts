import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/theme.service';
import { ParticlesBackgroundComponent } from './shared/particles-background.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ParticlesBackgroundComponent],
  templateUrl: './app.html',
  // styleUrl removed; using global Tailwind styles
})
export class App {
  protected readonly title = signal('portfolio');
  constructor(private theme: ThemeService) {
    this.theme.init();
  }

  toggleTheme() {
    this.theme.toggle();
  }
}
