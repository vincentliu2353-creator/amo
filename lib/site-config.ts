import type { NavItem } from "@/types";

export const siteConfig = {
  name: "AMO",
  shortName: "AMO",
  description:
    "AMO builds magnetic levitation platforms for OEM and ODM manufacturing systems across semiconductor, photonics, medical, and advanced automation sectors.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://amo.example.com",
  email: "sales@amo-motion.com",
  phone: "+86 400-000-0000",
  address: "Suzhou Industrial Park, Jiangsu, China",
};

export const mainNav: NavItem[] = [
  { href: "/products", label: "Products" },
  { href: "/cases", label: "Cases" },
  { href: "/oem-odm", label: "OEM & ODM" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: NavItem[] = [...mainNav];

export const footerCategories: NavItem[] = [
  { href: "/products", label: "Planar Motors" },
  { href: "/products", label: "Levitation Stages" },
  { href: "/products", label: "Transfer Modules" },
  { href: "/products", label: "OEM Platforms" },
];

export const footerPrograms: NavItem[] = [
  { href: "/oem-odm", label: "OEM Integration" },
  { href: "/oem-odm", label: "ODM Programs" },
  { href: "/cases", label: "Validation Cases" },
  { href: "/rfq", label: "RFQ Workflow" },
];

export const utilityNav: NavItem[] = [
  { href: "/favorites", label: "Favorites" },
  { href: "/rfq", label: "RFQ" },
];
