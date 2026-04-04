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
  category: string;
}

// Skill-to-title mapping from CSV dataset
export interface SkillMapping {
  title: string;
  category: string;
  skills: string[];
}

export const skillMappings: SkillMapping[] = [
  { title: "Software Engineer", category: "Technology", skills: ["Problem solving", "Code review", "Algorithms", "Debugging", "Version control", "System design", "Testing"] },
  { title: "Product Manager", category: "Business", skills: ["Roadmapping", "Stakeholder mgmt", "User research", "Prioritization", "Data analysis", "Communication", "Strategy"] },
  { title: "Data Analyst", category: "Technology", skills: ["SQL", "Data visualization", "Excel", "Statistical analysis", "Reporting", "Critical thinking", "Python"] },
  { title: "UX Designer", category: "Creative", skills: ["Wireframing", "User research", "Prototyping", "Figma", "Empathy", "Information architecture", "Usability testing"] },
  { title: "Sales Representative", category: "Business", skills: ["Negotiation", "Cold calling", "CRM", "Objection handling", "Relationship building", "Closing", "Prospecting"] },
  { title: "Marketing Manager", category: "Business", skills: ["Campaign management", "SEO", "Content strategy", "Analytics", "Brand management", "Social media", "Budgeting"] },
  { title: "Customer Service Rep", category: "Business", skills: ["Active listening", "Conflict resolution", "Empathy", "CRM", "Communication", "Problem solving", "Patience"] },
  { title: "Project Manager", category: "Business", skills: ["Planning", "Risk management", "Team coordination", "Budgeting", "Reporting", "Communication", "Agile"] },
  { title: "Graphic Designer", category: "Creative", skills: ["Adobe Suite", "Typography", "Color theory", "Layout", "Branding", "Creativity", "Attention to detail"] },
  { title: "Accountant", category: "Finance", skills: ["Bookkeeping", "Tax compliance", "Financial reporting", "Excel", "Attention to detail", "GAAP", "Auditing"] },
  { title: "Nurse", category: "Healthcare", skills: ["Patient care", "Clinical assessment", "Medication admin", "Empathy", "Teamwork", "Documentation", "Critical thinking"] },
  { title: "Teacher", category: "Education", skills: ["Lesson planning", "Classroom management", "Communication", "Assessment", "Patience", "Curriculum design", "Mentoring"] },
  { title: "Electrician", category: "Trade", skills: ["Wiring", "Safety compliance", "Troubleshooting", "Blueprint reading", "Problem solving", "Physical stamina", "Tools"] },
  { title: "Waiter / Server", category: "Trade", skills: ["Customer service", "Order accuracy", "Time management", "Upselling", "Teamwork", "Multitasking", "Conflict resolution"] },
  { title: "HR Manager", category: "Business", skills: ["Recruitment", "Employee relations", "Policy compliance", "Onboarding", "Performance management", "Mediation", "HRIS"] },
  { title: "Financial Analyst", category: "Finance", skills: ["Financial modeling", "Forecasting", "Excel", "Valuation", "Reporting", "Research", "Attention to detail"] },
  { title: "DevOps Engineer", category: "Technology", skills: ["CI/CD", "Docker", "Cloud infrastructure", "Automation", "Monitoring", "Linux", "Scripting"] },
  { title: "Content Writer", category: "Creative", skills: ["SEO writing", "Research", "Storytelling", "Editing", "Adaptability", "Grammar", "Deadline management"] },
  { title: "Business Analyst", category: "Business", skills: ["Requirements gathering", "Process mapping", "Data analysis", "Stakeholder mgmt", "Documentation", "SQL", "Problem solving"] },
  { title: "Pharmacist", category: "Healthcare", skills: ["Drug knowledge", "Patient counseling", "Accuracy", "Regulatory compliance", "Inventory", "Communication", "Ethics"] },
  { title: "Civil Engineer", category: "Technology", skills: ["AutoCAD", "Structural analysis", "Project management", "Math", "Blueprint reading", "Compliance", "Site supervision"] },
  { title: "Social Media Manager", category: "Creative", skills: ["Content creation", "Analytics", "Community mgmt", "Scheduling", "Brand voice", "Trend awareness", "Copywriting"] },
  { title: "Recruiter", category: "Business", skills: ["Sourcing", "Interviewing", "Negotiation", "Networking", "ATS", "Candidate assessment", "Communication"] },
  { title: "Lawyer", category: "Legal", skills: ["Legal research", "Drafting", "Argumentation", "Negotiation", "Attention to detail", "Client relations", "Ethics"] },
  { title: "Physician", category: "Healthcare", skills: ["Diagnosis", "Clinical reasoning", "Patient communication", "Medical knowledge", "Decision making", "Empathy", "Documentation"] },
  { title: "Operations Manager", category: "Business", skills: ["Process optimization", "Team leadership", "KPI tracking", "Budget management", "Supply chain", "Problem solving", "Reporting"] },
  { title: "Full Stack Developer", category: "Technology", skills: ["JavaScript", "React", "Node.js", "Databases", "REST APIs", "Git", "Problem solving"] },
  { title: "Architect", category: "Creative", skills: ["CAD", "Spatial design", "Building codes", "Client management", "Technical drawing", "Project planning", "Creativity"] },
  { title: "Psychologist", category: "Healthcare", skills: ["Assessment", "CBT", "Active listening", "Report writing", "Empathy", "Ethical practice", "Research"] },
  { title: "Logistics Coordinator", category: "Business", skills: ["Supply chain", "Scheduling", "Vendor management", "Documentation", "Problem solving", "ERP systems", "Communication"] },
  { title: "Chef", category: "Trade", skills: ["Menu planning", "Food safety", "Knife skills", "Inventory", "Time management", "Creativity", "Team leadership"] },
  { title: "IT Support Specialist", category: "Technology", skills: ["Troubleshooting", "Networking", "Hardware", "Ticketing systems", "Communication", "OS knowledge", "Patience"] },
  { title: "Real Estate Agent", category: "Business", skills: ["Negotiation", "Market knowledge", "Client relations", "Contracts", "Communication", "Networking", "Sales"] },
  { title: "Physical Therapist", category: "Healthcare", skills: ["Rehabilitation", "Assessment", "Exercise prescription", "Anatomy", "Patient motivation", "Documentation", "Empathy"] },
  { title: "Data Scientist", category: "Technology", skills: ["Machine learning", "Python", "Statistics", "Data wrangling", "Model evaluation", "Visualization", "SQL"] },
  { title: "Copywriter", category: "Creative", skills: ["Persuasive writing", "Brand voice", "Research", "SEO", "Editing", "Creativity", "Deadline management"] },
  { title: "Supply Chain Manager", category: "Business", skills: ["Procurement", "Inventory management", "Vendor negotiation", "Forecasting", "ERP", "Risk management", "Analytics"] },
  { title: "Dental Hygienist", category: "Healthcare", skills: ["Oral health assessment", "Patient education", "Instrument use", "X-ray", "Empathy", "Dexterity", "Documentation"] },
  { title: "Event Planner", category: "Creative", skills: ["Vendor coordination", "Budget management", "Logistics", "Creativity", "Communication", "Attention to detail", "Problem solving"] },
  { title: "Cybersecurity Analyst", category: "Technology", skills: ["Threat detection", "SIEM", "Penetration testing", "Risk assessment", "Incident response", "Networking", "Compliance"] },
  { title: "Barista", category: "Trade", skills: ["Coffee preparation", "Customer service", "Upselling", "Speed", "Hygiene", "Cash handling", "Teamwork"] },
  { title: "UX Researcher", category: "Creative", skills: ["User interviews", "Usability testing", "Survey design", "Data synthesis", "Personas", "Reporting", "Empathy"] },
  { title: "Mechanical Engineer", category: "Technology", skills: ["CAD", "Thermodynamics", "Manufacturing", "Problem solving", "Technical writing", "Prototyping", "Math"] },
  { title: "Accountancy Manager", category: "Finance", skills: ["Team leadership", "Financial oversight", "Compliance", "Tax planning", "Reporting", "Client management", "IFRS"] },
  { title: "Social Worker", category: "Healthcare", skills: ["Case management", "Empathy", "Crisis intervention", "Advocacy", "Documentation", "Community resources", "Ethics"] },
  { title: "Brand Manager", category: "Creative", skills: ["Brand strategy", "Market research", "Campaign management", "Cross-functional collaboration", "Analytics", "Copywriting", "Storytelling"] },
  { title: "Plumber", category: "Trade", skills: ["Pipe fitting", "Blueprint reading", "Troubleshooting", "Safety compliance", "Physical stamina", "Customer service", "Problem solving"] },
  { title: "Investment Banker", category: "Finance", skills: ["Financial modeling", "Valuation", "Deal structuring", "Pitching", "Due diligence", "Excel", "Client relations"] },
  { title: "Pharmacist Tech", category: "Healthcare", skills: ["Prescription processing", "Inventory", "Accuracy", "Patient service", "Compliance", "Data entry", "Teamwork"] },
  { title: "Web Developer", category: "Technology", skills: ["HTML/CSS", "JavaScript", "Responsive design", "CMS", "Debugging", "Git", "Performance optimization"] },
  { title: "Administrative Assistant", category: "Legal", skills: ["Scheduling", "Document management", "Communication", "Office software", "Multitasking", "Confidentiality", "Organization"] },
  { title: "Cashier", category: "Trade", skills: ["Cash handling", "Customer service", "Accuracy", "Speed", "POS systems", "Attention to detail", "Conflict resolution"] },
  { title: "Marketing Analyst", category: "Business", skills: ["Data analysis", "Market research", "Excel", "Reporting", "SEO", "A/B testing", "Critical thinking"] },
  { title: "Veterinarian", category: "Healthcare", skills: ["Diagnosis", "Surgery", "Animal handling", "Client communication", "Medical knowledge", "Empathy", "Documentation"] },
  { title: "Flight Attendant", category: "Trade", skills: ["Safety procedures", "Customer service", "Conflict resolution", "Communication", "First aid", "Adaptability", "Teamwork"] },
  { title: "Translator", category: "Creative", skills: ["Language proficiency", "Cultural awareness", "Attention to detail", "Research", "Writing", "Deadline management", "CAT tools"] },
  { title: "Cloud Architect", category: "Technology", skills: ["AWS/Azure/GCP", "System design", "Security", "Cost optimization", "DevOps", "Networking", "Documentation"] },
  { title: "Dental Assistant", category: "Healthcare", skills: ["Chairside assistance", "Sterilization", "X-ray", "Patient comfort", "Scheduling", "Dexterity", "Organization"] },
  { title: "PR Specialist", category: "Creative", skills: ["Media relations", "Press releases", "Crisis communication", "Storytelling", "Networking", "Social media", "Strategy"] },
  { title: "Quantity Surveyor", category: "Legal", skills: ["Cost estimation", "Tendering", "Contract management", "Blueprint reading", "Negotiation", "Reporting", "Math"] },
  { title: "Machine Learning Engineer", category: "Technology", skills: ["PyTorch/TensorFlow", "Model deployment", "Feature engineering", "Statistics", "Python", "MLOps", "Research"] },
  { title: "Paramedic", category: "Healthcare", skills: ["Emergency response", "Clinical assessment", "Medication admin", "Decision making", "Physical fitness", "Teamwork", "Communication"] },
  { title: "Interior Designer", category: "Creative", skills: ["Space planning", "CAD", "Client management", "Color theory", "Material selection", "Creativity", "Project management"] },
  { title: "Tax Advisor", category: "Finance", skills: ["Tax law", "Compliance", "Financial planning", "Client relations", "Attention to detail", "Research", "Negotiation"] },
  { title: "Warehouse Operative", category: "Trade", skills: ["Inventory management", "Forklift", "Order picking", "Health & safety", "Physical stamina", "Accuracy", "Teamwork"] },
  { title: "Dietitian", category: "Healthcare", skills: ["Nutritional assessment", "Meal planning", "Patient counseling", "Research", "Documentation", "Empathy", "Communication"] },
  { title: "System Administrator", category: "Technology", skills: ["Server management", "Networking", "Backups", "Scripting", "Troubleshooting", "Security", "Documentation"] },
  { title: "Fashion Designer", category: "Creative", skills: ["Pattern making", "Trend research", "Sewing", "Sketching", "Material knowledge", "Creativity", "Brand awareness"] },
  { title: "Compliance Officer", category: "Legal", skills: ["Regulatory knowledge", "Auditing", "Policy writing", "Risk assessment", "Reporting", "Ethics", "Communication"] },
  { title: "Occupational Therapist", category: "Healthcare", skills: ["Assessment", "Adaptive equipment", "Goal setting", "Documentation", "Empathy", "Rehab planning", "Communication"] },
  { title: "Account Manager", category: "Business", skills: ["Relationship management", "Upselling", "CRM", "Communication", "Problem solving", "Negotiation", "Reporting"] },
  { title: "Video Editor", category: "Creative", skills: ["Premiere/DaVinci", "Storytelling", "Color grading", "Sound design", "Attention to detail", "Pacing", "Client feedback"] },
  { title: "Biomedical Engineer", category: "Technology", skills: ["Medical device design", "Regulatory compliance", "Testing", "Data analysis", "Biology", "Problem solving", "Documentation"] },
  { title: "Mortgage Broker", category: "Finance", skills: ["Financial assessment", "Lending products", "Compliance", "Negotiation", "Client relations", "Documentation", "Sales"] },
  { title: "Personal Trainer", category: "Trade", skills: ["Exercise prescription", "Motivation", "Anatomy", "Client assessment", "Nutrition basics", "Safety", "Communication"] },
  { title: "Photographer", category: "Creative", skills: ["Camera operation", "Lighting", "Post-processing", "Composition", "Client management", "Creativity", "Storytelling"] },
  { title: "Procurement Manager", category: "Business", skills: ["Vendor management", "Contract negotiation", "Cost reduction", "RFQ/RFP", "Analytics", "Risk management", "Compliance"] },
  { title: "Speech Therapist", category: "Healthcare", skills: ["Assessment", "Communication therapy", "Documentation", "Empathy", "Goal setting", "Collaboration", "Research"] },
  { title: "Game Developer", category: "Technology", skills: ["Unity/Unreal", "C#/C++", "Game design", "Problem solving", "Physics", "Animation", "Testing"] },
  { title: "Actuary", category: "Finance", skills: ["Statistics", "Risk modeling", "Excel", "Insurance products", "Probability", "Reporting", "Communication"] },
  { title: "Carpenter", category: "Trade", skills: ["Joinery", "Blueprint reading", "Measurement", "Power tools", "Safety", "Physical dexterity", "Problem solving"] },
  { title: "SEO Specialist", category: "Creative", skills: ["Keyword research", "On-page SEO", "Link building", "Google Analytics", "Technical SEO", "Reporting", "Content strategy"] },
  { title: "Radiographer", category: "Healthcare", skills: ["Imaging equipment", "Patient positioning", "Radiation safety", "Anatomy", "Documentation", "Attention to detail", "Communication"] },
  { title: "Economist", category: "Finance", skills: ["Economic modeling", "Data analysis", "Research", "Report writing", "Statistics", "Policy analysis", "Critical thinking"] },
  { title: "IT Project Manager", category: "Technology", skills: ["Agile/Scrum", "Risk management", "Stakeholder communication", "Budgeting", "Resource planning", "JIRA", "Documentation"] },
  { title: "Makeup Artist", category: "Creative", skills: ["Color matching", "Skin prep", "Product knowledge", "Client consultation", "Creativity", "Hygiene", "Time management"] },
  { title: "Auditor", category: "Finance", skills: ["Financial statements", "Compliance", "Risk assessment", "Documentation", "Excel", "Analytical thinking", "Integrity"] },
  { title: "Childcare Worker", category: "Education", skills: ["Child development", "Safeguarding", "Communication", "Patience", "Activity planning", "First aid", "Empathy"] },
  { title: "Insurance Underwriter", category: "Finance", skills: ["Risk assessment", "Policy pricing", "Data analysis", "Decision making", "Compliance", "Communication", "Attention to detail"] },
  { title: "Environmental Scientist", category: "Technology", skills: ["Data collection", "Lab analysis", "GIS", "Report writing", "Compliance", "Research", "Fieldwork"] },
  { title: "Animator", category: "Creative", skills: ["3D modeling", "Rigging", "Motion principles", "Storytelling", "Adobe/Maya", "Attention to detail", "Client feedback"] },
  { title: "Optometrist", category: "Healthcare", skills: ["Eye examination", "Diagnosis", "Prescription", "Patient education", "Equipment use", "Empathy", "Documentation"] },
  { title: "Construction Manager", category: "Trade", skills: ["Site supervision", "Budget control", "Health & safety", "Scheduling", "Contractor mgmt", "Blueprint reading", "Problem solving"] },
  { title: "Legal Secretary", category: "Legal", skills: ["Document drafting", "Scheduling", "Confidentiality", "Legal terminology", "Office software", "Communication", "Organization"] },
  { title: "Nutritionist", category: "Healthcare", skills: ["Nutritional planning", "Client counseling", "Research", "Documentation", "Communication", "Empathy", "Health coaching"] },
  { title: "Music Producer", category: "Creative", skills: ["DAW proficiency", "Music theory", "Sound design", "Mixing", "Artist direction", "Networking", "Trend awareness"] },
  { title: "Penetration Tester", category: "Technology", skills: ["Ethical hacking", "Vulnerability assessment", "Kali Linux", "Report writing", "Networking", "Scripting", "OSINT"] },
  { title: "Lecturer", category: "Education", skills: ["Subject expertise", "Curriculum design", "Public speaking", "Research", "Assessment", "Mentoring", "Communication"] },
  { title: "Payroll Specialist", category: "Finance", skills: ["Payroll processing", "Tax compliance", "HRIS", "Attention to detail", "Confidentiality", "Excel", "Regulation knowledge"] },
];

// Generate fake companies and locations for job listings
const companies: Record<string, string[]> = {
  Technology: ["TechNova Inc.", "ByteForge Labs", "CloudPeak Systems", "NexGen Digital", "Quantum Solutions"],
  Business: ["Apex Consulting", "Summit Partners", "Pinnacle Group", "Vanguard Corp", "Bridge Advisory"],
  Creative: ["PixelCraft Studio", "Vivid Agency", "Mosaic Creative", "Spark & Co.", "Blueprint Media"],
  Finance: ["Meridian Capital", "Ironclad Finance", "Vertex Wealth", "Sterling & Associates", "Compass Financial"],
  Healthcare: ["Horizon Health", "CareFirst Medical", "Wellspring Clinic", "MedVantage Group", "Thrive Healthcare"],
  Trade: ["TradePoint Co.", "Summit Services", "ProBuild Inc.", "FieldWorks Ltd.", "CoreCraft Industries"],
  Education: ["BrightPath Academy", "LearnWell Institute", "Elevate Education", "Keystone Learning", "Aspire Schools"],
  Legal: ["Blackstone Legal", "Chambers & Associates", "Lexis Partners", "Judicial Solutions", "Gavel & Quill"],
};

const locations = ["Remote", "New York, NY", "San Francisco, CA", "Chicago, IL", "Austin, TX", "Los Angeles, CA", "Miami, FL", "Dallas, TX", "Seattle, WA", "Boston, MA", "Denver, CO", "Atlanta, GA"];
const types = ["Full-time", "Part-time", "Contract", "Full-time"];
const postedOptions = ["1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago", "1 week ago"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate salary ranges by category
function getSalaryRange(category: string, seed: number): [number, number] {
  const ranges: Record<string, [number, number]> = {
    Technology: [60000, 150000],
    Business: [50000, 120000],
    Creative: [40000, 95000],
    Finance: [55000, 140000],
    Healthcare: [45000, 130000],
    Trade: [28000, 65000],
    Education: [35000, 80000],
    Legal: [45000, 120000],
  };
  const [lo, hi] = ranges[category] || [30000, 80000];
  const min = Math.round((lo + seededRandom(seed) * (hi - lo) * 0.5) / 1000) * 1000;
  const max = Math.round((min + seededRandom(seed + 1) * (hi - min) * 0.6 + 10000) / 1000) * 1000;
  return [min, Math.min(max, hi)];
}

// Generate job listings from skill mappings
export const jobs: Job[] = skillMappings.map((mapping, i) => {
  const companyList = companies[mapping.category] || companies.Technology;
  const company = companyList[Math.floor(seededRandom(i * 7) * companyList.length)];
  const location = locations[Math.floor(seededRandom(i * 13) * locations.length)];
  const type = types[Math.floor(seededRandom(i * 17) * types.length)];
  const posted = postedOptions[Math.floor(seededRandom(i * 23) * postedOptions.length)];
  const [salaryMin, salaryMax] = getSalaryRange(mapping.category, i * 31);

  return {
    id: i + 1,
    title: mapping.title,
    company,
    location,
    salaryMin,
    salaryMax,
    type,
    posted,
    description: `Join our team as a ${mapping.title}. We're looking for someone skilled in ${mapping.skills.slice(0, 3).join(", ")} and more. This is a great opportunity to grow your career in the ${mapping.category.toLowerCase()} sector.`,
    skills: mapping.skills,
    category: mapping.category,
  };
});

export const allSkills = [...new Set(jobs.flatMap((j) => j.skills))];

export function searchJobsBySkill(query: string): Job[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return jobs.filter((job) =>
    job.skills.some((skill) => skill.toLowerCase().includes(q))
  );
}
