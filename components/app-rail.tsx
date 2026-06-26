"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconBallBowlingFilled,
  IconArrowUpRight,
  IconSearch,
  IconChartBar,
  IconDatabase,
} from "@tabler/icons-react";
import { LayoutGrid, PanelsTopLeft, Settings, BookOpen } from "lucide-react";
import { usePlaygroundStore } from "@/lib/stores/playground-store";
import { AuthMenu } from "@/components/auth-menu";
import { CommandPalette } from "@/components/command-palette";
import { LimitsPill } from "@/components/limits-pill";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const WIDTH = 145;

type SubNavItem = {
  label: string;
  href: string;
  match: (p: string) => boolean;
  running?: boolean;
};

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number }>;
  match: (p: string) => boolean;
  running?: boolean;
  children?: SubNavItem[];
};

export function AppRail() {
  const pathname = usePathname();
  const singleRunning = usePlaygroundStore(
    (s) =>
      s.executionStatus === "running" ||
      s.executionStatus === "generating-tests",
  );
  const battleRunning = usePlaygroundStore(
    (s) =>
      s.battleExecutionStatus === "running" ||
      s.battleExecutionStatus === "generating-tests",
  );
  const multiTurnRunning = usePlaygroundStore(
    (s) => s.multiTurnExecutionStatus === "running",
  );

  const items: NavItem[] = [
    {
      label: "Workspace",
      // parent nav defaults to current workspace mode; sub-items override
      href: pathname.startsWith("/battle")
        ? "/battle"
        : pathname.startsWith("/multi-turn")
          ? "/multi-turn"
          : "/",
      icon: PanelsTopLeft,
      match: (p) =>
        p === "/" || p.startsWith("/battle") || p.startsWith("/multi-turn"),
      running: singleRunning || battleRunning || multiTurnRunning,
      children: [
        {
          label: "Single",
          href: "/",
          match: (p) => p === "/",
          running: singleRunning,
        },
        {
          label: "Pairwise",
          href: "/battle",
          match: (p) => p.startsWith("/battle"),
          running: battleRunning,
        },
        {
          label: "Multi-turn",
          href: "/multi-turn",
          match: (p) => p.startsWith("/multi-turn"),
          running: multiTurnRunning,
        },
      ],
    },
    {
      label: "Gallery",
      href: "/gallery",
      icon: LayoutGrid,
      match: (p) => p.startsWith("/gallery") || p.startsWith("/run/"),
    },
    {
      label: "Datasets",
      href: "/datasets",
      icon: IconDatabase,
      match: (p) => p.startsWith("/datasets"),
    },
    {
      label: "Docs",
      href: "/docs",
      icon: BookOpen,
      match: (p) => p.startsWith("/docs"),
    },
    {
      label: "Benchmark",
      href: "/benchmark",
      icon: IconChartBar,
      match: (p) => p.startsWith("/benchmark"),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      match: (p) => p.startsWith("/settings"),
    },
  ];

  // dispatches cmd+k to trigger the command palette
  function openSearch() {
    const ev = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(ev);
  }

  return (
    <>
      {/* spacer matching sidebar width */}
      <div style={{ width: WIDTH }} className="shrink-0" aria-hidden />

      <aside
        style={{ width: WIDTH }}
        className="absolute left-0 top-0 bottom-0 z-30 flex flex-col justify-between border-r border-border bg-[#0f0f0f] shadow-surface-4 overflow-hidden"
      >
        <div>
          <div className="flex h-12 items-center justify-between px-3.5">
            <span className="flex items-center gap-2 text-[#d4d7d9]">
              <IconBallBowlingFilled size={18} className="shrink-0" />
              <span className="text-lg font-display font-semibold whitespace-nowrap">
                verity
              </span>
            </span>
            <Tooltip
              content="Open command palette (Cmd+K)"
              side="bottom"
              className="bg-black text-foreground rounded-sm"
            >
              <button
                type="button"
                onClick={openSearch}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open command palette"
              >
                <IconSearch size={15} />
              </button>
            </Tooltip>
          </div>

          <nav className="mt-2 flex flex-col gap-1 px-2">
            {items.map((it) => {
              const matched = it.match(pathname);
              const childActive =
                it.children?.some((c) => c.match(pathname)) ?? false;
              // prevent double highlight when sub-item is active
              const active = matched && !childActive;
              const Icon = it.icon;
              return (
                <div key={it.label} className="flex flex-col">
                  <Link
                    href={it.href}
                    className={cn(
                      "relative flex h-9 items-center gap-3 rounded-xl px-2 text-sm transition-colors",
                      active
                        ? "bg-foreground/5 text-foreground shadow-surface-6"
                        : "text-muted-foreground hover:bg-surface-3 hover:text-foreground",
                    )}
                  >
                    <span className="relative shrink-0 grid place-items-center w-5 h-5">
                      <Icon size={16} />
                      {it.running && !it.children && (
                        <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                      )}
                    </span>
                    <span className="whitespace-nowrap">{it.label}</span>
                  </Link>

                  {it.children && it.children.length > 0 && (
                    <div className="relative ml-[18px] mt-0.5 mb-1 flex flex-col gap-0.5 border-l border-border/60 pl-2">
                      {it.children.map((sub) => {
                        const subActive = sub.match(pathname);
                        return (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className={cn(
                              "relative flex h-7 items-center gap-2 rounded-md pl-2 pr-2 text-[12px] transition-colors",
                              subActive
                                ? "text-foreground bg-foreground/5"
                                : "text-muted-foreground hover:bg-surface-3 hover:text-foreground",
                            )}
                          >
                            <span className="whitespace-nowrap">
                              {sub.label}
                            </span>
                            {sub.running && (
                              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col p-3 gap-3 items-stretch">
          <div className="flex justify-start">
            <LimitsPill />
          </div>
          <AuthMenu expanded />
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/aryavcr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-[12px] text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="GitHub"
            >
              GitHub
              <IconArrowUpRight size={12} className="opacity-70" />
            </a>
            <a
              href="https://x.com/aryavcr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-[12px] text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
              aria-label="X"
            >
              X
              <IconArrowUpRight size={12} className="opacity-70" />
            </a>
          </div>
        </div>
      </aside>

      <CommandPalette />
    </>
  );
}
