import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { AppearDirective } from '../../shared/appear.directive';
import { WORK_ITEMS } from '../work/work.data';

@Component({
  selector: 'app-case-study-page',
  standalone: true,
  imports: [RouterLink, TitleCasePipe, AppearDirective],
  templateUrl: './case-study.page.html',
  styleUrl: './case-study.page.css'
})
export class CaseStudyPage {
  item = WORK_ITEMS.find(i => i.slug === this.route.snapshot.paramMap.get('slug')) || null;
  constructor(public route: ActivatedRoute) {}
}


