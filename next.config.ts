import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    optimizePackageImports: [
      "@tabler/icons-react",
      "lucide-react",
      "@phosphor-icons/react",
      "@remixicon/react",
    ],
  },
};

export default nextConfig;
