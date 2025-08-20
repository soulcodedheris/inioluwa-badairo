import { Component } from '@angular/core';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [BreadcrumbsComponent, RouterLink],
  templateUrl: './about.page.html',
  styleUrl: './about.page.css'
})
export class AboutPage {}


