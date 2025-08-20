import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, AsyncPipe],
  template: `
  <nav aria-label="Breadcrumb" class="mb-8 relative z-10 pointer-events-auto">
    <ol class="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs text-gray-700 backdrop-blur dark:bg-white/10 dark:text-gray-300">
      <li><a routerLink="/" class="hover:underline">Home</a></li>
      <ng-container *ngFor="let c of crumbs$ | async; let last = last">
        <li aria-hidden="true">/</li>
        <li>
          <a *ngIf="!last" [routerLink]="c.url" class="max-w-[50vw] truncate hover:underline">{{ c.label }}</a>
          <span *ngIf="last" class="max-w-[50vw] truncate text-gray-900 dark:text-gray-100" aria-current="page">{{ c.label }}</span>
        </li>
      </ng-container>
    </ol>
  </nav>
  `
})
export class BreadcrumbsComponent {
  readonly crumbs$;
  constructor(private bc: BreadcrumbService) {
    this.crumbs$ = this.bc.crumbs$;
  }
}


