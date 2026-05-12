/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="size-8" />

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors bg-surface-3 hover:bg-surface-3 hover:text-foreground"
      aria-label="Toggle theme"
    >
      {theme === "dark"
        ? <Sun size={20} strokeWidth={1.75} />
        : <Moon size={20} strokeWidth={1.75} />
      }
    </button>
  )
}