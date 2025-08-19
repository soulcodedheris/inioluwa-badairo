import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';

@Component({
  selector: 'app-principles-page',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './principles.page.html',
  styleUrl: './principles.page.css'
})
export class PrinciplesPage {}


