export interface Job {
  title: string;
  skills: string[];
}

export const jobs: Job[] = [
  {
    title: "Social Media Manager",
    skills: ["Content Creation", "Community Management", "Trend Analysis", "Brand Voice", "Copywriting", "Video Editing"],
  },
  {
    title: "Project Manager",
    skills: ["Team Leadership", "Task Delegation", "Strategic Planning", "Risk Management", "Budget Oversight", "Agile Workflow"],
  },
  {
    title: "Waiter",
    skills: ["Customer Service", "Order Accuracy", "Conflict Resolution", "Time Management", "Table Turnaround", "Verbal Communication"],
  },
  {
    title: "Barista",
    skills: ["Drink Crafting", "Workflow Speed", "Quality Control", "Machine Maintenance", "Sensory Evaluation", "Customer Connection"],
  },
  {
    title: "Cashier",
    skills: ["Transaction Accuracy", "Cash Handling", "Detail Orientation", "Loss Prevention", "Problem Solving", "Sales Support"],
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
