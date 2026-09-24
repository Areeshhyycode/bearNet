import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageCircleHeart,
  Settings,
  Sparkles,
  TerminalSquare,
  TrendingUp,
} from "lucide-react";

export type NavItem = {
  label: string;
  shortLabel: string;
  href: string;
  icon: LucideIcon;
  emoji: string;
  /** Sub-routes that should keep this item highlighted. */
  match?: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "My Learning Hub",
    shortLabel: "Hub",
    href: "/",
    icon: LayoutDashboard,
    emoji: "🎀",
  },
  {
    label: "Notes",
    shortLabel: "Notes",
    href: "/notes",
    icon: BookOpen,
    emoji: "📝",
    match: "/notes",
  },
  {
    label: "AI Tutor",
    shortLabel: "Tutor",
    href: "/tutor",
    icon: MessageCircleHeart,
    emoji: "🐼",
  },
  {
    label: "Quiz",
    shortLabel: "Quiz",
    href: "/quiz",
    icon: Sparkles,
    emoji: "🧠",
  },
  {
    label: "AI Exam",
    shortLabel: "Exam",
    href: "/exam",
    icon: GraduationCap,
    emoji: "🎓",
  },
  {
    label: "Cyber Lab",
    shortLabel: "Lab",
    href: "/lab",
    icon: TerminalSquare,
    emoji: "🐻‍❄️",
  },
  {
    label: "Progress",
    shortLabel: "Progress",
    href: "/progress",
    icon: TrendingUp,
    emoji: "🌷",
  },
  {
    label: "Settings",
    shortLabel: "Settings",
    href: "/settings",
    icon: Settings,
    emoji: "⚙️",
  },
];

export function isActivePath(pathname: string, item: NavItem) {
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
