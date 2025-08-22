import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DEMOS } from './demos.data';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
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

    <ng-container *ngIf="demo?.slug === 'preloader-motion'">
      <div class="mb-4 flex items-center gap-2">
        <label class="text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" [checked]="reduced" (change)="toggleReduced($event)"> Prefer reduced motion</label>
      </div>
      <div class="h-32 w-full rounded-lg border border-gray-200 dark:border-gray-700 grid place-items-center overflow-hidden relative">
        <div class="relative h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
        <div class="absolute h-10 w-10 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" [style.animationDuration]="reduced ? '1ms' : '1s'" [style.animationIterationCount]="reduced ? '1' : 'infinite'"></div>
      </div>
      <p class="mt-2 text-sm text-gray-500">Spinner respects reduced motion (checkbox or OS setting).</p>
    </ng-container>

    <ng-container *ngIf="demo?.slug === 'accessible-modal'">
      <button class="rounded border px-3 py-1 text-sm" (click)="openModal()">Open modal</button>
      <div class="fixed inset-0 bg-black/50" *ngIf="modalOpen" (click)="closeModal()"></div>
      <div *ngIf="modalOpen" class="fixed inset-0 grid place-items-center" (keydown.escape)="closeModal()">
        <div role="dialog" aria-modal="true" class="w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-black">
          <h2 class="text-lg font-semibold">Accessible modal</h2>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">Focus trap, ESC to close, backdrop click closes.</p>
          <div class="mt-4 flex justify-end gap-2">
            <button class="rounded border px-3 py-1 text-sm" (click)="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </ng-container>
  </section>
  `
})
export class DemoPage {
  demo: any = null;
  reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  modalOpen = false;
  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      this.demo = DEMOS.find(d => d.slug === slug) || null;
    });
  }
  toggleReduced(e: Event){
    const t = e.target as HTMLInputElement;
    this.reduced = !!t.checked;
  }
  openModal(){ this.modalOpen = true; }
  closeModal(){ this.modalOpen = false; }
}


