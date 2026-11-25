import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";

import "@/app/globals.css";

import { SiteChrome } from "@/components/layout/site-chrome";
import { SiteStoreProvider } from "@/components/providers/site-store-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { DEFAULT_METADATA_ROBOTS, absoluteUrl, generateOrganizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

const fontVariables = {
  "--font-display":
    '"Avenir Next Condensed", "Avenir Next", "Helvetica Neue", "Segoe UI", sans-serif',
  "--font-body": '"Avenir Next", "Helvetica Neue", "Segoe UI", sans-serif',
} as CSSProperties;

const FAVICON_PATH = "/amo-favicon.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "AMO | Magnetic Levitation Products Manufacturer & OEM Solutions",
    template: "%s | AMO",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  robots: DEFAULT_METADATA_ROBOTS,
  icons: {
    icon: [{ url: FAVICON_PATH, type: "image/png", sizes: "22x22" }],
    shortcut: [FAVICON_PATH],
    apple: [siteConfig.logoPath],
  },
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
    url: siteConfig.url,
    images: [
      {
        url: absoluteUrl("/images/home/hero/hero-bg.webp"),
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [absoluteUrl("/images/home/hero/hero-bg.webp")],
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased" style={fontVariables}>
        <JsonLd data={generateOrganizationJsonLd()} />
        <SiteStoreProvider>
          <SiteChrome>{children}</SiteChrome>
        </SiteStoreProvider>
      </body>
    </html>
  );
}
