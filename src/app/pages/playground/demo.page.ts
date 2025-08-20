import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DEMOS } from './demos.data';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [RouterLink, NgFor],
  template: `
  <section class="mx-auto min-h-dvh w-full max-w-3xl px-6 py-16">
    <a routerLink="/playground" class="text-sm text-gray-600 hover:underline">← Back to Playground</a>
    <header class="mt-6 mb-6">
      <h1 class="text-3xl font-semibold">{{ demo?.title || 'Demo' }}</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-300">{{ demo?.blurb }}</p>
      <div class="mt-2 flex flex-wrap gap-2">
        <span *ngFor="let t of demo?.tags" class="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-600 dark:text-gray-300">{{ t }}</span>
      </div>
    </header>
    <p class="text-sm text-gray-500">This space is reserved for the interactive demo (coming soon).</p>
  </section>
  `
})
export class DemoPage {
  demo = DEMOS.find(d => d.slug === this.route.snapshot.paramMap.get('slug')) || null;
  constructor(private route: ActivatedRoute) {}
}


