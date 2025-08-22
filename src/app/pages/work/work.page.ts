import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';
import { AppearDirective } from '../../shared/appear.directive';
import { WORK_ITEMS } from './work.data';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [RouterLink, AppearDirective, BreadcrumbsComponent, FormsModule, NgOptimizedImage],
  templateUrl: './work.page.html',
  styleUrl: './work.page.css'
})
export class WorkPage {
  items = WORK_ITEMS;
  q = signal('');
  qValue = '';
  selected = signal<Set<string>>(new Set());
  allTags = computed(() => {
    const s = new Set<string>();
    this.items.forEach(i => i.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  });
  filtered = computed(() => {
    const q = this.q().trim().toLowerCase();
    const sel = this.selected();
    return this.items.filter(i => {
      const hit = !q || i.title.toLowerCase().includes(q) || i.blurb.toLowerCase().includes(q);
      const tagOk = !sel.size || i.tags.some(t => sel.has(t));
      return hit && tagOk;
    });
  });
  toggle(t: string){
    const next = new Set(this.selected());
    next.has(t) ? next.delete(t) : next.add(t);
    this.selected.set(next);
  }

  clear(){
    this.selected.set(new Set());
  }
}


