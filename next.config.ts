import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the dev-mode badge; it covers the bottom-left of the portrait.
  devIndicators: false,
  images: {
    // 90 is used for the portrait so it stays crisp on high-density phone screens.
    qualities: [75, 90],
  },
};

export default nextConfig;
