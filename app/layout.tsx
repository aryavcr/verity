import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Verity',
  description: 'Continuous evaluation framework for LLMs',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable, interHeading.variable)}>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans bg-background text-foreground antialiased min-h-screen`}>
        <TooltipProvider delayDuration={300}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}

