export const DOMAINS = [
  'AI / Machine Learning', 'Frontend Engineering', 'Backend Systems',
  'Product Design', 'Cybersecurity', 'Open Source', 'Mobile',
  'Data Science', 'DevOps', 'Other',
];

export const STATUSES = ['building', 'looking_for_team', 'prototype', 'draft', 'completed'];

export const VISIBILITY = ['public', 'private'];

export const RANK_TIERS = [
  { name: 'Explorer', icon: '○', min: 0, next: 50 },
  { name: 'Builder', icon: '□', min: 50, next: 100 },
  { name: 'Architect', icon: '⊞', min: 100, next: 200 },
  { name: 'Innovator', icon: '△', min: 200, next: 400 },
  { name: 'Pyramidion', icon: '◇', min: 400, next: null },
];
