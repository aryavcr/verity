"use client";

import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { Tabs, TabsList, TabItem } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { usePlaygroundStore } from "@/lib/stores/playground-store";
import { cn } from "@/lib/utils";
import { UserIcon } from "./ui/user";
import { UsersRoundIcon } from "./ui/users-round";
import { GalleryVerticalEndIcon } from "./ui/gallery-vertical-end";
const TAB_ROUTES = [
  { value: "single", path: "/", label: "Single" },
  { value: "battle", path: "/battle", label: "Pairwise" },
  { value: "gallery", path: "/gallery", label: "Gallery" },
] as const;

function pathToTab(pathname: string): string {
  if (pathname.startsWith("/battle")) return "battle";
  if (pathname.startsWith("/gallery")) return "gallery";
  return "single";
}

function SpinnerIcon({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={cn("animate-spin", className)}
    >
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="20 12"
      />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const active = pathToTab(pathname);

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

  return (
    <header className="h-12 shrink-0 border-b-2 bg-surface-1 shadow-surface-3 flex items-center justify-between sticky top-0 px-2 z-20">
      {/*left*/}
      <div className="text-[#d4d7d9] tracking-widest flex -rotate-2 font-[Homemade_Apple] text-lg ml-3">
        Verity
      </div>

      {/*center*/}
      <Tabs
        value={active}
        onValueChange={(v) => {
          const route = TAB_ROUTES.find((t) => t.value === v);
          if (route) router.push(route.path);
        }}
      >
        <TabsList>
          <TabItem
            value="single"
            label="Single"
            icon={singleRunning ? SpinnerIcon : UserIcon}
          />
          <TabItem
            value="battle"
            label="Pairwise"
            icon={battleRunning ? SpinnerIcon : UsersRoundIcon}
          />
          <TabItem
            value="gallery"
            label="Gallery"
            icon={GalleryVerticalEndIcon}
          />
        </TabsList>
      </Tabs>

      {/*right*/}
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-4 mr-4">
          <a href="https://github.com/aryavcr">
            <IconBrandGithub />
          </a>
          <a href="https://x.com/aryavcr">
            <IconBrandX />
          </a>
        </div>
      </div>
    </header>
  );
}
