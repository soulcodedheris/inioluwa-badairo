export type WorkItem = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
};

export const WORK_ITEMS: WorkItem[] = [
  {
    slug: 'example-case',
    title: 'Example Case',
    blurb: 'From friction to flow. Interface simplification increased task completion by 22%.',
    tags: ['Angular', 'UX', 'Performance']
  },
  {
    slug: 'market-dashboard',
    title: 'Market Insights Dashboard',
    blurb: 'Real-time insights with fast filters and offline-ready caching. Time-to-insight down 35%.',
    tags: ['Angular', 'RxJS', 'State']
  },
  {
    slug: 'onboarding-flow',
    title: 'Frictionless Onboarding',
    blurb: 'Microcopy and progressive disclosure increased completion by 18% and reduced support tickets.',
    tags: ['UX Writing', 'A/B Test', 'Analytics']
  },
  {
    slug: 'design-system',
    title: 'Design System Foundations',
    blurb: 'Tokens, components, and docs to scale clarity across teams.',
    tags: ['Design System', 'Tailwind', 'Docs']
  }
];


