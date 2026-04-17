import {
  Home,
  Clock,
  HeartPulse,
  TrendingUp,
  GraduationCap,
  Plane,
  Wallet,
  Coffee,
  Baby,
  Bike,
  Dumbbell,
  Gift,
  Users,
  Laptop,
  Sparkles,
  Calendar,
  Award,
  Briefcase,
  PiggyBank,
  ShieldCheck,
  Zap,
  Sun,
  Heart,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Array<{ keywords: string[]; icon: LucideIcon }> = [
  { keywords: ["remote", "work from home", "wfh"], icon: Home },
  { keywords: ["flexible", "flex hours", "flexitime"], icon: Clock },
  { keywords: ["health", "medical", "dental", "insurance"], icon: HeartPulse },
  { keywords: ["pension", "401k", "retirement"], icon: PiggyBank },
  { keywords: ["stock", "equity", "options", "shares"], icon: TrendingUp },
  { keywords: ["training", "learning", "development", "course"], icon: GraduationCap },
  { keywords: ["holiday", "annual leave", "vacation", "pto", "days off"], icon: Plane },
  { keywords: ["bonus", "salary", "competitive pay", "compensation"], icon: Wallet },
  { keywords: ["snack", "lunch", "meal", "food", "coffee"], icon: Coffee },
  { keywords: ["parental", "maternity", "paternity", "childcare", "family"], icon: Baby },
  { keywords: ["cycle", "bike"], icon: Bike },
  { keywords: ["gym", "fitness", "wellness"], icon: Dumbbell },
  { keywords: ["discount", "perks", "voucher", "reward"], icon: Gift },
  { keywords: ["team", "social", "events", "culture"], icon: Users },
  { keywords: ["equipment", "laptop", "tech setup", "kit"], icon: Laptop },
  { keywords: ["mentorship", "coaching", "mentor"], icon: Award },
  { keywords: ["progression", "growth", "career"], icon: Briefcase },
  { keywords: ["pension", "savings"], icon: ShieldCheck },
  { keywords: ["fast", "rapid", "quick"], icon: Zap },
  { keywords: ["sabbatical", "summer"], icon: Sun },
  { keywords: ["volunteer", "charity", "giving"], icon: Heart },
  { keywords: ["onboarding", "induction", "schedule"], icon: Calendar },
];

export function getPerkIcon(text: string): LucideIcon {
  const lower = text.toLowerCase();
  for (const { keywords, icon } of ICON_MAP) {
    if (keywords.some((k) => lower.includes(k))) return icon;
  }
  return Sparkles;
}

interface PerkBadgeProps {
  text: string;
  variant?: "soft" | "outline";
}

export function PerkBadge({ text, variant = "soft" }: PerkBadgeProps) {
  const Icon = getPerkIcon(text);
  const base = "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors";
  const styles =
    variant === "soft"
      ? "bg-primary/8 border border-primary/15 text-foreground/85 hover:bg-primary/12"
      : "border border-[#E8E8E4] bg-white text-foreground/80 hover:border-primary/30";
  return (
    <span className={`${base} ${styles}`}>
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <span className="leading-tight">{text}</span>
    </span>
  );
}
