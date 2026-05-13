"use client";

import { ThemeProvider } from "next-themes";
import { ShapeProvider } from "@/lib/shape-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableColorScheme
      forcedTheme="dark"
      disableTransitionOnChange={false}
    >
      <ShapeProvider defaultShape="pill">{children}</ShapeProvider>
    </ThemeProvider>
  );
}
