export type WorkItem = {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
};

export const WORK_ITEMS: WorkItem[] = [
  {
    slug: 'example-case',
    title: 'Full-Stack E-commerce Platform',
    blurb: 'Built scalable e-commerce solution with microservices architecture. Increased performance by 40% and reduced deployment time by 60%.',
    tags: ['Angular', 'Node.js', 'Microservices', 'Performance']
  },
  {
    slug: 'market-dashboard',
    title: 'Real-time Analytics Dashboard',
    blurb: 'Developed real-time data processing pipeline with WebSocket connections and Redis caching. Time-to-insight down 35%.',
    tags: ['Angular', 'Node.js', 'WebSockets', 'Redis']
  },
  {
    slug: 'onboarding-flow',
    title: 'API-First User Onboarding',
    blurb: 'Designed RESTful APIs and progressive web app for seamless user onboarding. Increased completion by 18% and reduced support tickets.',
    tags: ['API Design', 'React', 'Node.js', 'Analytics']
  },
  {
    slug: 'design-system',
    title: 'Enterprise Design System',
    blurb: 'Architected component library with comprehensive documentation and automated testing. Scaled across 5 development teams.',
    tags: ['Design System', 'TypeScript', 'Testing', 'Documentation']
  }
];


