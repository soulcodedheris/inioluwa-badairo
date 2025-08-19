import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';
import { AppearDirective } from '../../shared/appear.directive';
import { WORK_ITEMS } from './work.data';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [RouterLink, AppearDirective, BreadcrumbsComponent],
  templateUrl: './work.page.html',
  styleUrl: './work.page.css'
})
export class WorkPage {
  items = WORK_ITEMS;
}


