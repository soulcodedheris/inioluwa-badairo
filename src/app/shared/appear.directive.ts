import { Directive, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAppear]',
  standalone: true
})
export class AppearDirective implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) {}

  ngOnInit(): void {
    const node = this.el.nativeElement;
    this.r.addClass(node, 'opacity-0');
    this.r.addClass(node, 'translate-y-3');
    this.r.addClass(node, 'transition');
    this.r.addClass(node, 'duration-700');
    this.r.addClass(node, 'ease-out');

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      this.r.removeClass(node, 'opacity-0');
      this.r.removeClass(node, 'translate-y-3');
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.r.removeClass(node, 'opacity-0');
          this.r.removeClass(node, 'translate-y-3');
          this.r.addClass(node, 'opacity-100');
          this.r.addClass(node, 'translate-y-0');
          this.observer?.disconnect();
          break;
        }
      }
    }, { threshold: 0.1 });

    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}


