export const currentUser = {
  name: 'Aarav Mehta',
  handle: '@aaravbuilds',
  role: 'Product Builder',
  program: 'BTech CSE 2023-27, Gautam Buddha University',
  avatar: 'https://i.pravatar.cc/160?img=12',
  rank: 'O2',
  rankLabel: 'Pyramidion II',
  points: 1240,
  nextRankProgress: 68,
  bio:
    'I build practical campus tools around collaboration, study systems, and project discovery. I am currently exploring product design, React, and data-driven skill mapping.',
  declaredSkills: ['Product Thinking', 'React', 'UX Writing', 'Team Building'],
  verifiedSkills: [
    { name: 'React', strength: 86 },
    { name: 'JavaScript', strength: 78 },
    { name: 'UI Design', strength: 72 },
    { name: 'Product', strength: 64 },
  ],
  activity: {
    projects: 6,
    collaborations: 12,
    skillsVerified: 9,
  },
};

export const collaborators = [
  {
    id: 1,
    name: 'Aaqib',
    role: 'Full-stack Builder',
    avatar: 'https://i.pravatar.cc/160?img=11',
    skills: ['React', 'Node', 'UI'],
    status: 'connected',
  },
  {
    id: 2,
    name: 'Meera',
    role: 'ML Explorer',
    avatar: 'https://i.pravatar.cc/160?img=47',
    skills: ['Python', 'Vision', 'Data'],
    status: 'pending',
  },
  {
    id: 3,
    name: 'Kabir',
    role: 'Frontend Engineer',
    avatar: 'https://i.pravatar.cc/160?img=15',
    skills: ['React', 'Motion', 'Design'],
    status: 'sent',
  },
  {
    id: 4,
    name: 'Sara',
    role: 'Product Designer',
    avatar: 'https://i.pravatar.cc/160?img=32',
    skills: ['Figma', 'UX', 'Research'],
    status: 'connected',
  },
  {
    id: 5,
    name: 'Rohan',
    role: 'Backend Learner',
    avatar: 'https://i.pravatar.cc/160?img=3',
    skills: ['Express', 'MongoDB', 'Auth'],
    status: 'pending',
  },
  {
    id: 6,
    name: 'Ananya',
    role: 'AI Builder',
    avatar: 'https://i.pravatar.cc/160?img=20',
    skills: ['ML', 'Python', 'NLP'],
    status: 'sent',
  },
];

export const projects = [
  {
    id: 1,
    title: 'Campus Skill Graph',
    description: 'Maps student projects to verified skills so teams can find the right builders faster.',
    domain: 'Developer Tools',
    stack: ['React', 'Graph UI', 'Tailwind'],
    creator: 'Aarav',
    avatar: 'https://i.pravatar.cc/160?img=12',
    status: 'Building',
  },
  {
    id: 2,
    title: 'Study Pod Matcher',
    description: 'A lightweight matching tool for forming focused study and build groups across domains.',
    domain: 'Education',
    stack: ['Vite', 'Mock Data', 'UX'],
    creator: 'Meera',
    avatar: 'https://i.pravatar.cc/160?img=47',
    status: 'Looking for team',
  },
  {
    id: 3,
    title: 'Hackathon Portfolio Kit',
    description: 'A template system for students to turn hackathon work into polished portfolio case studies.',
    domain: 'Portfolio',
    stack: ['React', 'Content', 'Design'],
    creator: 'Kabir',
    avatar: 'https://i.pravatar.cc/160?img=15',
    status: 'Prototype',
  },
  {
    id: 4,
    title: 'Peer Review Board',
    description: 'A structured feedback board for project demos, code walkthroughs, and design critique.',
    domain: 'Collaboration',
    stack: ['React', 'Forms', 'State'],
    creator: 'Sara',
    avatar: 'https://i.pravatar.cc/160?img=32',
    status: 'Research',
  },
];

export const domains = [
  { id: 1, name: 'AI / Machine Learning', builders: 42, projects: 18, skills: ['Python', 'ML', 'Data'] },
  { id: 2, name: 'Frontend Engineering', builders: 56, projects: 24, skills: ['React', 'CSS', 'UX'] },
  { id: 3, name: 'Backend Systems', builders: 31, projects: 13, skills: ['Node', 'APIs', 'Databases'] },
  { id: 4, name: 'Product Design', builders: 28, projects: 11, skills: ['Figma', 'Research', 'UI'] },
  { id: 5, name: 'Cybersecurity', builders: 19, projects: 7, skills: ['Linux', 'Network', 'Audit'] },
  { id: 6, name: 'Open Source', builders: 23, projects: 9, skills: ['Git', 'Docs', 'Review'] },
];

export const teams = [
  {
    id: 1,
    name: 'Skill Graph Core',
    project: 'Campus Skill Graph',
    members: ['Aarav', 'Sara', 'Kabir'],
    needs: ['Backend', 'Data Modeling'],
    status: '2 seats open',
  },
  {
    id: 2,
    name: 'Study Pod Sprint',
    project: 'Study Pod Matcher',
    members: ['Meera', 'Ananya'],
    needs: ['Frontend', 'UX Testing'],
    status: 'Recruiting',
  },
  {
    id: 3,
    name: 'Portfolio Kit Crew',
    project: 'Hackathon Portfolio Kit',
    members: ['Kabir', 'Rohan'],
    needs: ['Content', 'Design QA'],
    status: 'Reviewing invites',
  },
];

export const connectionGroups = {
  connected: collaborators.filter((person) => person.status === 'connected'),
  pending: collaborators.filter((person) => person.status === 'pending'),
  sent: collaborators.filter((person) => person.status === 'sent'),
};

export const requests = [
  {
    id: 1,
    from: 'Rohan',
    reason: 'Wants to help with API planning for Campus Skill Graph.',
    avatar: 'https://i.pravatar.cc/160?img=3',
    skills: ['Express', 'MongoDB', 'Auth'],
  },
  {
    id: 2,
    from: 'Meera',
    reason: 'Looking for a React teammate for Study Pod Matcher.',
    avatar: 'https://i.pravatar.cc/160?img=47',
    skills: ['Python', 'Vision', 'Data'],
  },
];

export const conversations = [
  {
    id: 1,
    user: 'Sara',
    avatar: 'https://i.pravatar.cc/160?img=32',
    preview: 'I updated the profile flow wireframe.',
    messages: [
      { id: 1, sender: 'Sara', text: 'I updated the profile flow wireframe.', mine: false },
      { id: 2, sender: 'Aarav', text: 'Nice. I will connect it with the project cards.', mine: true },
      { id: 3, sender: 'Sara', text: 'Also keep verified skills separate from declared skills.', mine: false },
    ],
  },
  {
    id: 2,
    user: 'Meera',
    avatar: 'https://i.pravatar.cc/160?img=47',
    preview: 'Can we add a team size field?',
    messages: [
      { id: 1, sender: 'Meera', text: 'Can we add a team size field?', mine: false },
      { id: 2, sender: 'Aarav', text: 'Yes, I will add it to the project creation form.', mine: true },
    ],
  },
  {
    id: 3,
    user: 'Kabir',
    avatar: 'https://i.pravatar.cc/160?img=15',
    preview: 'The project feed needs tech tags.',
    messages: [
      { id: 1, sender: 'Kabir', text: 'The project feed needs tech tags.', mine: false },
      { id: 2, sender: 'Aarav', text: 'Already added. Next is filtering by domain.', mine: true },
    ],
  },
];

export const rankMilestones = [
  { label: 'O1', title: 'Starter Builder', complete: true },
  { label: 'O2', title: 'Verified Collaborator', complete: true },
  { label: 'O3', title: 'Project Lead', complete: false },
  { label: 'O4', title: 'Campus Builder', complete: false },
];
