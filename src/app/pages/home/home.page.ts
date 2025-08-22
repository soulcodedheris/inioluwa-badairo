import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppearDirective } from '../../shared/appear.directive';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AppearDirective, NgOptimizedImage],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage {
}


