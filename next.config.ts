import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  devIndicators: false,
  experimental: {
    viewTransition: true,
    optimizePackageImports: [
      "@tabler/icons-react",
      "lucide-react",
      "@phosphor-icons/react",
      "@lobehub/icons",
    ],
  },
  async redirects() {
    return [
      { source: "/multi-turn/compare", destination: "/compare", permanent: false },
      { source: "/gallery", destination: "/history", permanent: true },
      { source: "/docs/guides/gallery", destination: "/docs/guides/history", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
