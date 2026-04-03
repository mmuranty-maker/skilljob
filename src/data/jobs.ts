export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  type: string;
  posted: string;
  description: string;
  skills: string[];
}

export const jobs: Job[] = [
  {
    id: 1,
    title: "Social Media Manager",
    company: "BrandWave Agency",
    location: "Remote",
    salaryMin: 55000,
    salaryMax: 75000,
    type: "Full-time",
    posted: "2 days ago",
    description: "Lead our social media presence across all major platforms. You'll create engaging content strategies, manage community interactions, and analyze performance metrics to grow brand awareness and engagement.",
    skills: ["Content Creation", "Community Management", "Trend Analysis", "Brand Voice", "Copywriting", "Video Editing"],
  },
  {
    id: 2,
    title: "Project Manager",
    company: "BuildRight Solutions",
    location: "New York, NY",
    salaryMin: 80000,
    salaryMax: 110000,
    type: "Full-time",
    posted: "1 day ago",
    description: "Oversee cross-functional projects from initiation to delivery. You'll coordinate teams, manage timelines and budgets, and ensure deliverables meet quality standards using agile methodologies.",
    skills: ["Team Leadership", "Task Delegation", "Strategic Planning", "Risk Management", "Budget Oversight", "Agile Workflow"],
  },
  {
    id: 3,
    title: "Waiter / Server",
    company: "The Grand Bistro",
    location: "Chicago, IL",
    salaryMin: 30000,
    salaryMax: 45000,
    type: "Full-time",
    posted: "3 days ago",
    description: "Provide exceptional dining experiences in a fast-paced upscale restaurant. Handle high-volume service, resolve customer concerns, and coordinate with kitchen staff to ensure timely delivery.",
    skills: ["Customer Service", "Order Accuracy", "Conflict Resolution", "Time Management", "Table Turnaround", "Verbal Communication"],
  },
  {
    id: 4,
    title: "Barista",
    company: "Roast & Bloom Coffee",
    location: "Austin, TX",
    salaryMin: 28000,
    salaryMax: 38000,
    type: "Full-time",
    posted: "5 days ago",
    description: "Craft specialty beverages and build customer relationships in a high-traffic specialty coffee shop. Maintain equipment, ensure quality consistency, and contribute to a welcoming atmosphere.",
    skills: ["Drink Crafting", "Workflow Speed", "Quality Control", "Machine Maintenance", "Sensory Evaluation", "Customer Connection"],
  },
  {
    id: 5,
    title: "Cashier",
    company: "MegaMart Retail",
    location: "Los Angeles, CA",
    salaryMin: 30000,
    salaryMax: 40000,
    type: "Part-time",
    posted: "1 day ago",
    description: "Process transactions accurately and efficiently while providing friendly customer service. Handle cash and card payments, manage returns, and support loss prevention initiatives.",
    skills: ["Transaction Accuracy", "Cash Handling", "Detail Orientation", "Loss Prevention", "Problem Solving", "Sales Support"],
  },
  {
    id: 6,
    title: "Customer Success Manager",
    company: "CloudSync SaaS",
    location: "Remote",
    salaryMin: 65000,
    salaryMax: 90000,
    type: "Full-time",
    posted: "4 days ago",
    description: "Drive customer retention and satisfaction by building strong relationships, onboarding new clients, and proactively identifying upsell opportunities within our enterprise customer base.",
    skills: ["Customer Service", "Conflict Resolution", "Strategic Planning", "Verbal Communication", "Problem Solving", "Community Management"],
  },
  {
    id: 7,
    title: "Operations Coordinator",
    company: "SwiftLogistics Co.",
    location: "Dallas, TX",
    salaryMin: 45000,
    salaryMax: 60000,
    type: "Full-time",
    posted: "2 days ago",
    description: "Coordinate daily operations across warehouse and distribution teams. Optimize workflows, track inventory, and ensure smooth communication between departments.",
    skills: ["Task Delegation", "Time Management", "Detail Orientation", "Agile Workflow", "Order Accuracy", "Budget Oversight"],
  },
  {
    id: 8,
    title: "Content Creator",
    company: "ViralSpark Media",
    location: "Remote",
    salaryMin: 40000,
    salaryMax: 65000,
    type: "Contract",
    posted: "6 days ago",
    description: "Produce engaging short-form and long-form content across social platforms. Collaborate with brand partners, analyze content performance, and stay ahead of platform trends.",
    skills: ["Content Creation", "Video Editing", "Copywriting", "Trend Analysis", "Brand Voice", "Customer Connection"],
  },
  {
    id: 9,
    title: "Retail Team Lead",
    company: "UrbanStyle Fashion",
    location: "Miami, FL",
    salaryMin: 38000,
    salaryMax: 52000,
    type: "Full-time",
    posted: "3 days ago",
    description: "Lead a team of retail associates to exceed sales targets. Manage scheduling, coach team members, handle escalated customer issues, and maintain visual merchandising standards.",
    skills: ["Team Leadership", "Customer Service", "Sales Support", "Conflict Resolution", "Cash Handling", "Verbal Communication"],
  },
  {
    id: 10,
    title: "Quality Assurance Analyst",
    company: "PrecisionTech Labs",
    location: "San Francisco, CA",
    salaryMin: 70000,
    salaryMax: 95000,
    type: "Full-time",
    posted: "1 day ago",
    description: "Ensure product quality through systematic testing and evaluation. Document defects, collaborate with engineering teams, and maintain quality standards across all product releases.",
    skills: ["Quality Control", "Detail Orientation", "Problem Solving", "Risk Management", "Sensory Evaluation", "Order Accuracy"],
  },
];

export const allSkills = [...new Set(jobs.flatMap((j) => j.skills))];

export function searchJobsBySkill(query: string): Job[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return jobs.filter((job) =>
    job.skills.some((skill) => skill.toLowerCase().includes(q))
  );
}
