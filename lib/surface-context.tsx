"use client";

import { createContext, useContext, type ReactNode } from "react";

type SurfaceLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const SurfaceContext = createContext<SurfaceLevel>(1);

export function SurfaceProvider({
  level,
  children,
}: {
  level: SurfaceLevel;
  children: ReactNode;
}) {
  return (
    <SurfaceContext.Provider value={level}>{children}</SurfaceContext.Provider>
  );
}

export function useSurface(): SurfaceLevel {
  return useContext(SurfaceContext);
}
