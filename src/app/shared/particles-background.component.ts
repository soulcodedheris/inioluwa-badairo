import { AfterViewInit, Component, ElementRef, HostBinding, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-particles-background',
  standalone: true,
  template: `<div id="particles-js" aria-hidden="true"></div>`,
  styles: [`:host{position:fixed;inset:0;pointer-events:none;z-index:0} #particles-js{width:100%;height:100%}`]
})
export class ParticlesBackgroundComponent implements AfterViewInit, OnDestroy {
  @HostBinding('attr.role') role = 'presentation';
  private prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private get motionEnabled(): boolean {
    try {
      const v = localStorage.getItem('motion');
      if (v === 'off') return false;
    } catch {}
    return !this.prefersReduced;
  }
  private themeObserver?: MutationObserver;

  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) {}

  async ngAfterViewInit(): Promise<void> {
    // Initial render if motion enabled (defer via requestIdleCallback if available)
    const start = async () => {
      if (this.motionEnabled) {
        await this.ensureLibrary();
        this.render();
      } else {
        this.clear();
      }
    };
    const ric = (window as any).requestIdleCallback as ((cb: () => void, opts?: any) => any) | undefined;
    if (typeof ric === 'function') ric(() => start()); else setTimeout(() => start(), 0);

    // Re-render when theme or motion changes (class or data-motion on <html>)
    this.themeObserver = new MutationObserver(async () => {
      if (!this.motionEnabled) {
        this.clear();
        return;
      }
      const run = async () => { await this.ensureLibrary(); this.render(); };
      const ric2 = (window as any).requestIdleCallback as ((cb: () => void, opts?: any) => any) | undefined;
      if (typeof ric2 === 'function') ric2(() => run()); else setTimeout(() => run(), 0);
    });
    this.themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-motion'] });
  }

  ngOnDestroy(): void {
    // particles.js does not expose a destroy per instance; clear container
    this.clear();
    this.themeObserver?.disconnect();
  }

  private async ensureLibrary(): Promise<void> {
    if ((window as any).particlesJS) return;
    
    // Load as a classic script (non-module) to avoid strict-mode issues (caller/callee)
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[data-particlesjs]') as HTMLScriptElement | null;
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(), { once: true });
        return;
      }
      
      const s = document.createElement('script');
      // Prefer local vendor file; fallback to CDN
      s.src = '/vendor/particles.min.js';
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.setAttribute('data-particlesjs', 'true');
      
      s.onload = () => resolve();
      s.onerror = () => {
        console.warn('particles.min.js failed to load; disabling particles background');
        resolve();
      };
      document.head.appendChild(s);
    });
  }

  private render(): void {
    try {
      const container = this.host.nativeElement.querySelector('#particles-js');
      if (!container) return;
      
      container.innerHTML = '';
      
      // Check if particlesJS is available
      if (typeof (window as any).particlesJS !== 'function') {
        console.warn('particlesJS not available, skipping render');
        return;
      }
      
      const dark = document.documentElement.classList.contains('dark');
      const color = dark ? '#ffffff' : '#111111';
      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      const reducedRoutes = ['/articles', '/work', '/principles'];
      const particleCount = reducedRoutes.some(p => path.startsWith(p)) ? 40 : 80;
      
      const options = {
        particles: {
          number: { value: particleCount, density: { enable: true, value_area: 800 } },
          color: { value: color },
          shape: { type: 'circle', stroke: { width: 0, color: '#000000' }, polygon: { nb_sides: 5 } },
          opacity: { value: 0.5, random: false, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
          size: { value: 3, random: true, anim: { enable: false, speed: 40, size_min: 0.1, sync: false } },
          line_linked: { enable: true, distance: 150, color: color, opacity: 0.4, width: 1 },
          move: { enable: true, speed: 6, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
        },
        interactivity: {
          detect_on: 'window',
          events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
          modes: {
            grab: { distance: 400, line_linked: { opacity: 1 } },
            bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
            repulse: { distance: 200 },
            push: { particles_nb: 4 },
            remove: { particles_nb: 2 }
          }
        },
        retina_detect: true
      } as const;
      
      // Run outside Angular zone for better performance
      this.zone.runOutsideAngular(() => {
        try {
          (window as any).particlesJS('particles-js', options);
        } catch (error) {
          console.warn('Failed to initialize particles:', error);
        }
      });
    } catch (error) {
      console.warn('Error rendering particles:', error);
    }
  }

  private clear(): void {
    try {
      const el = this.host.nativeElement.querySelector('#particles-js');
      if (el) el.innerHTML = '';
    } catch (error) {
      console.warn('Error clearing particles:', error);
    }
  }
}


