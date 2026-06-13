import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));
const AMO_SITE_IMAGE_HOSTNAME = "amo.example.com";
const DEFAULT_SUPABASE_STORAGE_HOSTNAME = "nejotkmyuwswoihgxrfz.supabase.co";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseHostname = supabaseUrl ? new URL(supabaseUrl).hostname : null;
const allowedImageHostnames = Array.from(
  new Set(
    [AMO_SITE_IMAGE_HOSTNAME, DEFAULT_SUPABASE_STORAGE_HOSTNAME, supabaseHostname].filter(
      (hostname): hostname is string => Boolean(hostname),
    ),
  ),
);

const nextConfig: NextConfig = {
  outputFileTracingRoot: workspaceRoot,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560, 3840],
    formats: ["image/webp"],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 80, 85, 88, 90, 92],
    remotePatterns: allowedImageHostnames.map((hostname) => ({
      protocol: "https",
      hostname,
      pathname: "/**",
    })),
  },
  reactStrictMode: true,
};

export default nextConfig;
