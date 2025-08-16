import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="grid min-h-dvh place-items-center px-6">
      <div class="text-center">
        <h1 class="text-6xl font-bold">404</h1>
        <p class="mt-3 text-gray-600 dark:text-gray-300">We couldn't find that page.</p>
        <a routerLink="/" class="mt-6 inline-block rounded bg-gray-900 px-4 py-2 text-white hover:bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200">Go home</a>
      </div>
    </section>
  `
})
export class NotFoundPage {}


