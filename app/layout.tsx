import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import {Homemade_Apple} from "next/font/google";
import "./globals.css";

const homemadeApple = Homemade_Apple({
  variable: "--font-logo",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Verity",
  description: "Continuous evaluation for LLMs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} ${homemadeApple.variable}`}
    >
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@700,500,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
