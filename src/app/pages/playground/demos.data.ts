export type Demo = { slug: string; title: string; blurb: string; tags: string[] };

export const DEMOS: Demo[] = [
  {
    slug: 'preloader-motion',
    title: 'Preloader motion study',
    blurb: 'Respecting reduced-motion while keeping character.',
    tags: ['CSS', 'Motion']
  },
  {
    slug: 'canvas-orbit',
    title: 'Canvas particle orbit',
    blurb: 'Tiny orbital system built on Canvas 2D.',
    tags: ['Canvas', 'JS']
  },
  {
    slug: 'accessible-modal',
    title: 'Accessible modal',
    blurb: 'Focus trap, aria roles, inert background.',
    tags: ['A11y', 'Angular']
  }
];


