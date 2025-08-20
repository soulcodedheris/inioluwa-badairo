import { Component, computed, signal } from '@angular/core';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';
import { RouterLink } from '@angular/router';
import { DEMOS, type Demo } from './demos.data';

@Component({
  selector: 'app-playground-page',
  standalone: true,
  imports: [BreadcrumbsComponent, RouterLink],
  templateUrl: './playground.page.html',
  styleUrl: './playground.page.css'
})

export class PlaygroundPage {
  demos = signal<Demo[]>(DEMOS);
  selected = signal<Set<string>>(new Set());

  allTags = computed(() => {
    const s = new Set<string>();
    this.demos().forEach(d => d.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  });

  filtered = computed(() => {
    const pick = this.selected();
    if (!pick.size) return this.demos();
    return this.demos().filter(d => d.tags.some(t => pick.has(t)));
  });

  toggle(tag: string): void {
    const next = new Set(this.selected());
    if (next.has(tag)) next.delete(tag); else next.add(tag);
    this.selected.set(next);
  }

  clear(): void {
    this.selected.set(new Set());
  }
}


