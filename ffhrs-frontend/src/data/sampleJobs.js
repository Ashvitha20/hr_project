/**
 * PLACEHOLDER DATA — for UI development only.
 * Replace all usages with `useQuery` calls against `GET /jobs` once the
 * backend Job API (see project spec, Module: Jobs) is available.
 * Shape mirrors the intended Job schema so swapping in real data is a
 * drop-in change: id, title, company, location, department, experience,
 * salary, employmentType, remote/hybrid, skills[], description, postedAgo.
 */
export const sampleJobs = [
  {
    id: 'jd-101',
    title: 'Senior Full Stack Developer',
    company: 'Future Focus Client — FinTech',
    location: 'Chennai, TN',
    department: 'Engineering',
    experience: '5-8 yrs',
    salary: '₹18L - ₹26L / yr',
    employmentType: 'Full-time',
    remote: false,
    skills: ['React', 'Node.js', 'MongoDB', 'AWS'],
    postedAgo: '2 days ago',
    description:
      'We are looking for a Senior Full Stack Developer to design and build scalable web applications for a fast-growing fintech client. You will own features end-to-end across the MERN stack, mentor junior engineers, and collaborate closely with product and design.',
    responsibilities: [
      'Design and implement REST APIs and React front-ends',
      'Own code quality, testing, and deployment pipelines',
      'Mentor junior developers and conduct code reviews',
    ],
    requirements: [
      "Bachelor's degree in Computer Science or equivalent experience",
      '5+ years building production Node.js/React applications',
      'Strong understanding of MongoDB schema design',
    ],
  },
  {
    id: 'jd-102',
    title: 'HR Business Partner',
    company: 'Future Focus Client — Manufacturing',
    location: 'Bengaluru, KA',
    department: 'Human Resources',
    experience: '4-6 yrs',
    salary: '₹12L - ₹16L / yr',
    employmentType: 'Full-time',
    remote: false,
    skills: ['Employee Relations', 'HRIS', 'Talent Management'],
    postedAgo: '5 days ago',
    description:
      'Partner with business leaders to drive HR strategy, employee engagement, and workforce planning for a mid-size manufacturing unit.',
    responsibilities: [
      'Advise leadership on org design and workforce planning',
      'Manage employee relations and performance processes',
      'Drive engagement and retention initiatives',
    ],
    requirements: [
      "Master's degree in HR or related field",
      '4+ years as an HRBP in a manufacturing/industrial setting',
    ],
  },
  {
    id: 'jd-103',
    title: 'Digital Marketing Executive',
    company: 'Future Focus HR Solutions',
    location: 'Remote',
    department: 'Marketing',
    experience: '1-3 yrs',
    salary: '₹5L - ₹8L / yr',
    employmentType: 'Remote',
    remote: true,
    skills: ['SEO', 'Google Ads', 'Content Strategy'],
    postedAgo: '1 week ago',
    description:
      'Join our in-house digital marketing team to plan and execute campaigns that grow our client pipeline and employer brand presence.',
    responsibilities: [
      'Plan and run paid and organic campaigns',
      'Report on campaign performance and ROI',
      'Coordinate with content and design teams',
    ],
    requirements: [
      '1-3 years of hands-on digital marketing experience',
      'Familiarity with Google Analytics and Ads',
    ],
  },
  {
    id: 'jd-104',
    title: 'Payroll Specialist',
    company: 'Future Focus Client — Healthcare',
    location: 'Hyderabad, TS',
    department: 'Finance & Payroll',
    experience: '2-4 yrs',
    salary: '₹6L - ₹9L / yr',
    employmentType: 'Contract',
    remote: false,
    skills: ['Payroll Processing', 'Compliance', 'Excel'],
    postedAgo: '3 days ago',
    description:
      'Manage end-to-end payroll processing and statutory compliance for a growing healthcare network across multiple states.',
    responsibilities: [
      'Process monthly payroll for 500+ employees',
      'Ensure PF/ESI/TDS compliance',
      'Resolve payroll queries and discrepancies',
    ],
    requirements: [
      "Bachelor's degree in Commerce or Finance",
      '2+ years of payroll processing experience in India',
    ],
  },
];

export const sampleBlogPosts = [
  {
    id: 'why-hr-planning-matters',
    title: 'Why Is Human Resource Planning Important?',
    excerpt:
      'From workforce productivity to succession planning, strategic HRP keeps organizations resilient as they grow.',
    category: 'HR Strategy',
    author: 'FFHRS Editorial Team',
    date: '2026-05-12',
    content:
      'Human Resource Planning (HRP) ensures the workforce is aligned with organizational goals, helps companies adapt to industry change, saves cost by avoiding last-minute hiring, promotes long-term growth through targeted development, and enables succession planning for key roles.',
  },
  {
    id: 'reducing-time-to-hire',
    title: '5 Ways to Reduce Time-to-Hire Without Sacrificing Quality',
    excerpt:
      'Speed and quality are not mutually exclusive — here is how top recruiting teams do both.',
    category: 'Recruitment',
    author: 'FFHRS Editorial Team',
    date: '2026-04-02',
    content:
      'A structured intake call, a tightly scoped scorecard, pre-vetted talent pools, and fast feedback loops between hiring managers and recruiters are the biggest levers for cutting time-to-hire.',
  },
];

export const testimonials = [
  {
    name: 'Priya Raman',
    role: 'Talent Acquisition Lead, TechNova',
    quote:
      'Future Focus helped us fill three critical engineering roles in under three weeks with candidates who were still with us a year later.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Founder, Bright Path Logistics',
    quote:
      'Their payroll and compliance support took a huge operational burden off our small HR team.',
  },
  {
    name: 'Sneha Kulkarni',
    role: 'VP People, MedCare Health',
    quote:
      'The executive search process was thorough, transparent, and genuinely felt like a partnership.',
  },
];
