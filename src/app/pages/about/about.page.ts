import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [BreadcrumbsComponent],
  templateUrl: './about.page.html',
  styleUrl: './about.page.css'
})
export class AboutPage {}


