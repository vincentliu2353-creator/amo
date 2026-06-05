import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { HomeSiteFooter } from "@/components/layout/home-site-footer";
import { HomeSiteHeader } from "@/components/layout/home-site-header";
import { SiteStoreProvider } from "@/components/providers/site-store-provider";
import { QuoteDock } from "@/components/rfq/quote-dock";
import { siteConfig } from "@/lib/site-config";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "AMO | Magnetic Levitation Systems for OEM Manufacturing",
    template: "%s | AMO",
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${displayFont.variable} ${bodyFont.variable} font-body antialiased`}>
        <SiteStoreProvider>
          <div className="relative flex min-h-screen flex-col overflow-x-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(166,232,255,0.05),transparent_24%)]" />
            <HomeSiteHeader />
            <div className="relative flex-1">{children}</div>
            <HomeSiteFooter />
            <QuoteDock />
          </div>
        </SiteStoreProvider>
      </body>
    </html>
  );
}
