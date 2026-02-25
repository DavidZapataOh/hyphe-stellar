"use client";

import { usePathname } from "next/navigation";
import {
  Compass,
  Trophy,
  Users,
  ArrowLeftRight,
  Newspaper,
  TrendingUp,
  Swords,
  Clock,
  Droplets,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  value: string;
  label: string;
  icon: typeof Compass;
  special?: boolean;
}

const categories: Category[] = [
  { value: "all", label: "All Markets", icon: Compass },
  { value: "World Cup 2026", label: "World Cup 2026", icon: Trophy, special: true },
  { value: "Transfers", label: "Transfers", icon: ArrowLeftRight },
  { value: "Player Value", label: "Player Value", icon: TrendingUp },
  { value: "Leagues", label: "Leagues", icon: Swords },
  { value: "Rumors", label: "Rumors & News", icon: Newspaper },
  { value: "National Teams", label: "National Teams", icon: Users },
];

const filters = [
  { id: "ending-soon", label: "Ending Soon", icon: Clock },
  { id: "high-liquidity", label: "High Liquidity", icon: Droplets },
  { id: "verified-only", label: "Verified Only", icon: ShieldCheck },
];

interface SidebarProps {
  className?: string;
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
  activeFilters?: string[];
  onFilterToggle?: (filterId: string) => void;
}

export function Sidebar({
  className,
  activeCategory = "all",
  onCategoryChange,
  activeFilters = [],
  onFilterToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/markets";

  return (
    <aside
      className={cn(
        "w-64 shrink-0 border-r border-border/50 bg-sidebar",
        className,
      )}
    >
      <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6 scrollbar-none">
        {/* Explore Section */}
        <div>
          <h4 className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Explore
          </h4>
          <nav className="space-y-0.5">
            {categories.map(({ value, label, icon: Icon, special }) => {
              const active = isHome && activeCategory === value;

              if (special) {
                return (
                  <button
                    key={value}
                    onClick={() => onCategoryChange?.(value)}
                    className={cn(
                      "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
                      active
                        ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/10 text-amber-400 shadow-[inset_0_0_0_1px_oklch(0.75_0.18_85/0.3)]"
                        : "text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-400",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    <span className="ml-auto flex h-2 w-2">
                      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-amber-400 opacity-50" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
                    </span>
                  </button>
                );
              }

              return (
                <button
                  key={value}
                  onClick={() => onCategoryChange?.(value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && "text-primary")} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filter By Section */}
        <div>
          <h4 className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Filter By
          </h4>
          <div className="space-y-1 px-1">
            {filters.map(({ id, label, icon: Icon }) => {
              const active = activeFilters.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => onFilterToggle?.(id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                      active
                        ? "border-primary bg-primary"
                        : "border-border/60 bg-transparent",
                    )}
                  >
                    {active && (
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>
    </aside>
  );
}
