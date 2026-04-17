import {
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  Cpu,
  Building2,
  Megaphone,
  Palette,
  Landmark,
  BookOpen,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface IndustryEntry {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  chipBg: string;
  chipFg: string;
}

// Each industry gets a tinted chip background + darker icon color.
// Used by both the funnel quiz (Step 2) and the homepage hero tile grid.
export const INDUSTRIES: IndustryEntry[] = [
  { title: "Hospitality & Food Service", subtitle: "Hotels, restaurants, events", icon: UtensilsCrossed, chipBg: "hsl(38, 92%, 92%)", chipFg: "hsl(32, 75%, 38%)" },
  { title: "Retail & Customer Service", subtitle: "Shops, support, client-facing roles", icon: ShoppingBag, chipBg: "hsl(340, 82%, 94%)", chipFg: "hsl(340, 70%, 45%)" },
  { title: "Healthcare & Medicine", subtitle: "Hospitals, clinics, care roles", icon: Heart, chipBg: "hsl(8, 88%, 93%)", chipFg: "hsl(8, 72%, 48%)" },
  { title: "Technology & Engineering", subtitle: "Software, hardware, IT", icon: Cpu, chipBg: "hsl(212, 90%, 93%)", chipFg: "hsl(212, 80%, 45%)" },
  { title: "Business & Operations", subtitle: "Admin, logistics, management", icon: Building2, chipBg: "hsl(215, 18%, 92%)", chipFg: "hsl(215, 25%, 35%)" },
  { title: "Sales & Marketing", subtitle: "Revenue, campaigns, outreach", icon: Megaphone, chipBg: "hsl(22, 92%, 92%)", chipFg: "hsl(22, 85%, 45%)" },
  { title: "Creative & Media", subtitle: "Design, content, film, music", icon: Palette, chipBg: "hsl(272, 75%, 94%)", chipFg: "hsl(272, 60%, 50%)" },
  { title: "Finance & Accounting", subtitle: "Banking, bookkeeping, auditing", icon: Landmark, chipBg: "hsl(155, 45%, 90%)", chipFg: "hsl(155, 55%, 25%)" },
  { title: "Education & Social Care", subtitle: "Teaching, training, community", icon: BookOpen, chipBg: "hsl(178, 60%, 90%)", chipFg: "hsl(178, 60%, 30%)" },
  { title: "Trades & Construction", subtitle: "Plumbing, electrical, building", icon: Wrench, chipBg: "hsl(32, 38%, 88%)", chipFg: "hsl(28, 45%, 35%)" },
];
